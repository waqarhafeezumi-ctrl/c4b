import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Server is ready to take our messages');
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Admin Email Template
const createAdminEmail = (data) => {
  return `
    <h2>New Loan Application Received</h2>
    <p><strong>Business Name:</strong> ${data.businessName}</p>
    <p><strong>Owner Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Loan Amount Requested:</strong> ${data.loanAmount}</p>
    <p><strong>Annual Revenue:</strong> ${data.annualRevenue}</p>
    <p><strong>Time in Business:</strong> ${data.timeInBusiness}</p>
    <p><strong>Credit Score:</strong> ${data.creditScore}</p>
    <p><strong>Industry:</strong> ${data.industry}</p>
    <hr />
    <p>This application was submitted via bznzloans.com.</p>
  `;
};

// Customer Email Template
const createCustomerEmail = (data) => {
  return `
    <h2>Application Received - bznzloans.com</h2>
    <p>Dear ${data.firstName},</p>
    <p>Thank you for submitting your loan application with bznzloans.com. We have received your request for funding.</p>
    <p><strong>Application Details:</strong></p>
    <ul>
      <li><strong>Requested Amount:</strong> ${data.loanAmount}</li>
      <li><strong>Business Name:</strong> ${data.businessName}</li>
    </ul>
    <p>Our team is currently reviewing your information and will contact you shortly at ${data.phone} or via this email address to discuss the next steps.</p>
    <p>If you have any immediate questions, please reply to this email or call us at 1-888-501-1070.</p>
    <br />
    <p>Best regards,</p>
    <p>The bznzloans.com Team</p>
  `;
};

app.post('/api/send-email', async (req, res) => {
  const data = req.body;

  try {
    // 1. Send Email to Admin (info@bznzloans.com)
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'bznzloans'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: 'info@bznzloans.com', // Admin email
      subject: `New Loan Application: ${data.businessName}`,
      html: createAdminEmail(data),
    });

    // 2. Send Confirmation Email to Customer
    if (data.email) {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'bznzloans'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: data.email,
        subject: 'We have received your loan application - bznzloans.com',
        html: createCustomerEmail(data),
      });
    }

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
