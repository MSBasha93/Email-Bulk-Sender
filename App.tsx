import React, { useState, useRef, useCallback } from 'react';

import type { Contact, LogEntry, TemplateData } from './types';
import { LogType } from './types';
import { DEFAULT_SUBJECT, DEFAULT_BODY_HTML } from './constants';
import { parseExcelFile, exportToExcel, readJsonFile, saveJsonTemplate } from './services/fileService';
import { sendEmail } from './services/emailService';

import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { FileHandler } from './components/FileHandler';
import { SettingsPanel } from './components/SettingsPanel';
import { ColumnManager } from './components/ColumnManager';
import { TemplatePanel } from './components/TemplatePanel';
import { EmailEditor } from './components/EmailEditor';
import { TestPanel } from './components/TestPanel';
import { StatusLog } from './components/StatusLog';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [subject, setSubject] = useState<string>(DEFAULT_SUBJECT);
  const [body, setBody] = useState<string>(DEFAULT_BODY_HTML);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const campaignStopFlag = useRef<boolean>(false);

  const [testRecipient, setTestRecipient] = useState<string>('test@example.com');
  const [sendDelay, setSendDelay] = useState<number>(1000);
  const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });

  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [emailColumn, setEmailColumn] = useState<string>('Contact_Email_0');
  const [companyColumn, setCompanyColumn] = useState<string>('Company_Name_0');

  const addLog = useCallback((message: string, type: LogType = LogType.INFO) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), message: `[${new Date().toLocaleTimeString()}] ${message}`, type }]);
  }, []);

  const handleFileSelect = (fileProcessor: (file: File) => Promise<any>, successHandler: (result: any, file: File) => void, acceptedTypes: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes;
    input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            try {
                const result = await fileProcessor(file);
                successHandler(result, file);
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred.";
                addLog(`Error processing file: ${message}`, LogType.ERROR);
                alert(`Error processing file: ${message}`);
            }
        }
    };
    input.click();
  };
  
  const handleLoadExcel = () => {
    handleFileSelect(parseExcelFile, (parsedContacts: Contact[], file) => {
        if (parsedContacts.length > 0) {
            const columns = Object.keys(parsedContacts[0]);
            setAvailableColumns(columns);
            // Auto-detect common column names
            const emailCol = columns.find(c => c.toLowerCase().includes('email')) || columns[0] || '';
            const companyCol = columns.find(c => c.toLowerCase().includes('company')) || '';
            setEmailColumn(emailCol);
            setCompanyColumn(companyCol);

            // Reset Send_Status if it exists, or add it
            const processedContacts = parsedContacts.map(c => ({...c, 'Send_Status': ''}));
            
            setContacts(processedContacts);
            setOriginalFileName(file.name);
            setStats({ sent: 0, failed: 0, total: processedContacts.length });
            addLog(`Successfully loaded ${processedContacts.length} contacts from ${file.name}.`, LogType.SUCCESS);
        } else {
            addLog(`No contacts found in ${file.name}.`, LogType.WARNING);
        }
    }, ".xlsx, .xls, .csv");
  };

  const handleDownloadSheet = () => {
    if (contacts.length === 0) {
        addLog("No contact data to export.", LogType.WARNING);
        return;
    }
    try {
        exportToExcel(contacts, originalFileName);
        addLog("Successfully exported updated contact sheet.", LogType.SUCCESS);
    } catch (error) {
        addLog(`Failed to export sheet: ${error}`, LogType.ERROR);
    }
  };

  const handleLoadTemplate = () => {
    handleFileSelect(readJsonFile, (data: TemplateData) => {
        setSubject(data.subject);
        setBody(data.body);
        addLog("Successfully loaded email template.", LogType.SUCCESS);
    }, ".json");
  };

  const handleSaveTemplate = () => {
    try {
        saveJsonTemplate({ subject, body });
        addLog("Successfully saved email template.", LogType.SUCCESS);
    } catch (error) {
        addLog(`Failed to save template: ${error}`, LogType.ERROR);
    }
  };
  
  const processPlaceholders = (text: string, contact: Contact): string => {
      let processedText = text;
      if (companyColumn && contact[companyColumn]) {
        processedText = processedText.replace(/\[company_name\]/gi, String(contact[companyColumn]));
      }
      // Fallback for company name if placeholder is still present
      processedText = processedText.replace(/\[company_name\]/gi, 'شركتكم الموقرة');
      return processedText;
  };

  const handleSendTest = async () => {
      if (!testRecipient) {
          addLog("Test recipient email is not set.", LogType.WARNING);
          alert("Please enter a test recipient email address.");
          return;
      }
      addLog(`Sending test email to ${testRecipient}...`);
      setIsSendingTest(true);
      try {
          const result = await sendEmail(testRecipient, subject, body);
          if (result.success) {
              addLog(`Test email sent successfully to ${testRecipient}.`, LogType.SUCCESS);
          } else {
              addLog(`Failed to send test email: ${result.message}`, LogType.ERROR);
          }
      } catch (error) {
          addLog(`An error occurred while sending test email: ${error}`, LogType.ERROR);
      } finally {
          setIsSendingTest(false);
      }
  };
  
  const handleStartCampaign = async () => {
    if (!emailColumn) {
        addLog("Email column is not selected. Please map the email column.", LogType.ERROR);
        alert("Please select the column containing email addresses in the Column Mapping section.");
        return;
    }

    const contactsToSend = contacts.filter(c => c['Send_Status'] !== 'Sent' && c[emailColumn]);
    if (contactsToSend.length === 0) {
        addLog("No contacts to send emails to. All contacts have been processed or lack an email address.", LogType.WARNING);
        return;
    }

    addLog(`Starting campaign for ${contactsToSend.length} contacts...`, LogType.INFO);
    setIsSending(true);
    campaignStopFlag.current = false;
    setStats(prev => ({ ...prev, sent: 0, failed: 0, total: contacts.length }));

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (campaignStopFlag.current) {
            addLog("Campaign stopped by user.", LogType.WARNING);
            break;
        }

        if (contact['Send_Status'] === 'Sent' || !contact[emailColumn]) {
            continue; // Skip already sent or contacts with no email
        }

        const recipient = contact[emailColumn];
        const finalSubject = processPlaceholders(subject, contact);
        const finalBody = processPlaceholders(body, contact);

        try {
            const result = await sendEmail(recipient, finalSubject, finalBody);
            
            const newContacts = [...contacts];
            if (result.success) {
                newContacts[i]['Send_Status'] = 'Sent';
                addLog(`( ${i + 1}/${contacts.length} ) Email sent to ${recipient}`, LogType.SUCCESS);
                setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
            } else {
                newContacts[i]['Send_Status'] = `Failed: ${result.message}`;
                addLog(`( ${i + 1}/${contacts.length} ) Failed to send to ${recipient}: ${result.message}`, LogType.ERROR);
                setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
            }
            setContacts(newContacts);

        } catch (error) {
            addLog(`( ${i + 1}/${contacts.length} ) Critical error sending to ${recipient}: ${error}`, LogType.ERROR);
            setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
        }

        if (i < contacts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, sendDelay));
        }
    }

    addLog("Campaign finished.", LogType.INFO);
    setIsSending(false);
  };

  const handleStopCampaign = () => {
      campaignStopFlag.current = true;
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Disclaimer />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SettingsPanel 
                onStart={handleStartCampaign}
                onStop={handleStopCampaign}
                isSending={isSending}
                sendDelay={sendDelay}
                onSendDelayChange={setSendDelay}
                stats={stats}
                contactsLoaded={contacts.length > 0}
            />
            <FileHandler 
                onLoadExcel={handleLoadExcel}
                onDownloadSheet={handleDownloadSheet}
                contactsLoaded={contacts.length > 0}
                fileName={originalFileName}
            />
             <ColumnManager 
                availableColumns={availableColumns}
                emailColumn={emailColumn}
                onEmailColumnChange={setEmailColumn}
                companyColumn={companyColumn}
                onCompanyColumnChange={setCompanyColumn}
                contactsLoaded={contacts.length > 0}
            />
             <TemplatePanel 
                onLoadTemplate={handleLoadTemplate}
                onSaveTemplate={handleSaveTemplate}
            />
            <TestPanel 
                testRecipient={testRecipient}
                onTestRecipientChange={setTestRecipient}
                onSendTest={handleSendTest}
                isSending={isSendingTest}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <EmailEditor 
                subject={subject}
                onSubjectChange={setSubject}
                body={body}
                onBodyChange={setBody}
            />
            <StatusLog log={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
