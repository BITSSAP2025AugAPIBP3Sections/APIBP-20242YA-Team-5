// Notification utility that can be added to any service
// Note: Install nodemailer when ready for production email integration

export class NotificationService {
  constructor() {
    // For now, we'll use console logging
    // In production, initialize email transporter here
    console.log('📧 Notification service initialized (console mode)');
  }

  async sendCertificateIssued(to: string, certificateData: any) {
    const emailContent = {
      from: process.env.FROM_EMAIL || 'noreply@student-cert-system.com',
      to,
      subject: 'Certificate Issued Successfully',
      html: `
        <h2>Certificate Issued</h2>
        <p>Dear ${certificateData.studentName},</p>
        <p>Your certificate for <strong>${certificateData.courseName}</strong> has been issued successfully.</p>
        <p><strong>Certificate Number:</strong> ${certificateData.certificateNumber}</p>
        <p><strong>Grade:</strong> ${certificateData.grade}</p>
        <p>You can download your certificate using verification code: <strong>${certificateData.verificationCode}</strong></p>
        <br>
        <p>Best regards,<br>${certificateData.universityName || 'University'}</p>
      `
    };

    // For now, log to console (replace with actual email sending in production)
    console.log('📧 EMAIL TO SEND:', emailContent);
    
    // Simulate email sending
    return Promise.resolve({ 
      success: true, 
      messageId: `mock_${Date.now()}`,
      to,
      subject: emailContent.subject
    });
  }

  async sendCertificateRevoked(to: string, certificateData: any, reason: string) {
    const emailContent = {
      from: process.env.FROM_EMAIL || 'noreply@student-cert-system.com',
      to,
      subject: 'Certificate Revoked',
      html: `
        <h2>Certificate Revoked</h2>
        <p>Dear ${certificateData.studentName},</p>
        <p>Your certificate <strong>${certificateData.certificateNumber}</strong> has been revoked.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you have any questions, please contact your university.</p>
        <br>
        <p>Best regards,<br>${certificateData.universityName || 'University'}</p>
      `
    };

    // For now, log to console (replace with actual email sending in production)
    console.log('📧 EMAIL TO SEND:', emailContent);
    
    return Promise.resolve({ 
      success: true, 
      messageId: `mock_${Date.now()}`,
      to,
      subject: emailContent.subject
    });
  }

  async sendUniversityVerified(to: string, universityData: any) {
    const emailContent = {
      from: process.env.FROM_EMAIL || 'noreply@student-cert-system.com',
      to,
      subject: 'University Verification Approved',
      html: `
        <h2>University Verification Approved</h2>
        <p>Dear ${universityData.name},</p>
        <p>Your university has been successfully verified in our system.</p>
        <p>You can now start issuing certificates.</p>
        <br>
        <p>Best regards,<br>Certificate Verification System</p>
      `
    };

    // For now, log to console (replace with actual email sending in production)
    console.log('📧 EMAIL TO SEND:', emailContent);
    
    return Promise.resolve({ 
      success: true, 
      messageId: `mock_${Date.now()}`,
      to,
      subject: emailContent.subject
    });
  }

  // Helper method to enable actual email sending when ready
  async enableEmailTransport() {
    console.log('💡 To enable actual email sending:');
    console.log('1. npm install nodemailer @types/nodemailer');
    console.log('2. Set SMTP environment variables');
    console.log('3. Uncomment email transporter initialization');
    return Promise.resolve({ enabled: false, mode: 'console' });
  }
}