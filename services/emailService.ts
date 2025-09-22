
interface MockSendResult {
    success: boolean;
    message: string;
}

export const sendEmail = (recipient: string, subject: string, body: string): Promise<MockSendResult> => {
    console.log(`Simulating email send to: ${recipient}`);
    console.log(`Subject: ${subject}`);
    
    return new Promise(resolve => {
        // Simulate network delay between 300ms and 1000ms
        const delay = Math.random() * 700 + 300;
        
        setTimeout(() => {
            // Simulate a 95% success rate
            if (Math.random() < 0.95) {
                resolve({ success: true, message: 'Email sent successfully.' });
            } else {
                resolve({ success: false, message: 'SMTP server connection failed.' });
            }
        }, delay);
    });
};
