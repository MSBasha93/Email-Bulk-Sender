
import type { Contact, TemplateData } from '../types';

declare const XLSX: any;

export const parseExcelFile = (file: File): Promise<Contact[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);
                const contactsWithId = json.map((row, index) => ({ ...row, id: index }));
                resolve(contactsWithId);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsBinaryString(file);
    });
};

export const exportToExcel = (contacts: Contact[], originalFileName: string): void => {
    if (contacts.length === 0) {
        alert("No contact data to export.");
        return;
    }
    
    // Create a copy without the 'id' field for export
    const contactsForExport = contacts.map(({ id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(contactsForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Email_and_Phone");
    
    const newFileName = originalFileName ? 
        `${originalFileName.replace(/\.(xlsx|xls|csv)$/, '')}_updated.xlsx` : 
        'contacts_updated.xlsx';

    XLSX.writeFile(workbook, newFileName);
};

export const readJsonFile = (file: File): Promise<TemplateData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const text = e.target?.result as string;
                const data: TemplateData = JSON.parse(text);
                if (typeof data.subject === 'string' && typeof data.body === 'string') {
                    resolve(data);
                } else {
                    reject(new Error("Invalid template format."));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsText(file, 'utf-8');
    });
};

export const saveJsonTemplate = (data: TemplateData): void => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
