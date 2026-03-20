import { LoanFormData } from '../components/LoanForm';

const API_URL = 'http://localhost:3001/api/send-email';

export const sendLoanApplicationEmails = async (data: LoanFormData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send emails via server');
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    // Re-throw to be handled by the form component
    throw error;
  }
};
