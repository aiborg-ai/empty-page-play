import { useState } from 'react';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Home
} from 'lucide-react';
import { CartItem } from '../types/subscription';

interface PaymentSuccessProps {
  invoiceId: string;
  cartItems: CartItem[];
  total: number;
  onGoHome: () => void;
}

export default function PaymentSuccess({ 
  invoiceId, 
  cartItems, 
  total, 
  onGoHome 
}: PaymentSuccessProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const generateInvoicePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // In a real implementation, you would:
      // 1. Call an API to generate PDF invoice
      // 2. Use a library like jsPDF or puppeteer on the backend
      // 3. Return PDF blob or download link

      // Simulating PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a simple invoice content for demo
      const invoiceContent = generateInvoiceHTML();
      
      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendEmailInvoice = async () => {
    try {
      // In a real implementation, you would call your backend API
      // to send the invoice via email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const generateInvoiceHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoiceId}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .company { color: #3b82f6; font-size: 24px; font-weight: bold; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .items table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items th, .items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .items th { background-color: #f8f9fa; }
        .total { text-align: right; font-size: 18px; font-weight: bold; color: #3b82f6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">InnoSpot</div>
        <p>Innovation Intelligence Platform</p>
    </div>
    
    <div class="invoice-info">
        <div>
            <strong>Invoice Number:</strong> ${invoiceId}<br>
            <strong>Date:</strong> ${currentDate}<br>
            <strong>Status:</strong> Paid
        </div>
    </div>
    
    <div class="items">
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${cartItems.map(item => `
                    <tr>
                        <td>${item.product.name}</td>
                        <td>${item.product.description}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.product.price}</td>
                        <td>$${item.product.price * item.quantity}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="total">
        <p>Total: $${total}</p>
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>InnoSpot - Discover. Analyze. Innovate.</p>
    </div>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your subscription has been activated and you now have access to your selected services.
          </p>

          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-medium text-gray-900">{invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium text-gray-900">{cartItems.length}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-lg font-semibold">Total Paid:</span>
                <span className="text-lg font-bold text-green-600">${total}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Subscriptions</h3>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">{item.product.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.product.billingPeriod} subscription • Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-green-600 font-medium">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={generateInvoicePDF}
                disabled={isGeneratingPDF}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </>
                )}
              </button>

              <button
                onClick={sendEmailInvoice}
                disabled={isEmailSent}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
              >
                {isEmailSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Email Sent
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Email Invoice
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Your subscriptions are now active and ready to use
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Access your services from the main dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Check your email for setup instructions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Contact support if you need any assistance
              </li>
            </ul>
          </div>

          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}