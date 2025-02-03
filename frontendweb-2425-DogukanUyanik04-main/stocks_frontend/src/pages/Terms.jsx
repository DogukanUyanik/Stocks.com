import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';  

const Terms = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Terms of Service</h1>

      <div className="mb-4">
        <p>Welcome to <strong>Stocks.com</strong>. These Terms of Service govern your access to and use of our website. By using our services, you agree to comply with and be bound by these terms.</p>

        <h2 className="mt-4">1. Acceptance of Terms</h2>
        <p>By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, you must immediately stop using the website.</p>

        <h2 className="mt-4">2. Account Registration</h2>
        <p>In order to use certain features of the website, you may need to create an account. You agree to provide accurate and complete information during the registration process and to keep your account details up to date.</p>

        <h2 className="mt-4">3. User Conduct</h2>
        <p>You agree to use the website in accordance with applicable laws and regulations. You must not use our website for any unlawful, fraudulent, or harmful activities, and you must not interfere with the website’s functionality.</p>

        <h2 className="mt-4">4. Intellectual Property</h2>
        <p>The content on the website, including text, images, logos, and other materials, is protected by copyright and intellectual property laws. You may not copy, modify, or distribute any content from our website without our prior consent.</p>

        <h2 className="mt-4">5. Transactions and Payments</h2>
        <p>If you make a transaction through the website, you agree to provide accurate and complete information. You are responsible for ensuring that you have sufficient funds for any transaction you wish to make.</p>

        <h2 className="mt-4">6. Limitation of Liability</h2>
        <p>We will not be held liable for any damages or losses that occur from using our website, including indirect, incidental, or consequential damages. We do not guarantee the accuracy, availability, or security of the website.</p>

        <h2 className="mt-4">7. Privacy</h2>
        <p>Your privacy is important to us. Please review our <a href="/privacy" className="text-decoration-none">Privacy Policy</a> to understand how we collect, use, and protect your personal information.</p>

        <h2 className="mt-4">8. Changes to the Terms</h2>
        <p>We reserve the right to update or modify these Terms of Service at any time. Any changes will be posted on this page, and the updated terms will be effective as soon as they are posted.</p>

        <h2 className="mt-4">9. Termination</h2>
        <p>We may suspend or terminate your access to the website at our sole discretion, if we believe you have violated these Terms of Service.</p>

        <h2 className="mt-4">10. Governing Law</h2>
        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Stocks.com operates, without regard to its conflict of law principles.</p>

        <h2 className="mt-5">Educational Purpose Disclaimer</h2>
        <p>This website and its contents are for educational purposes only. The transactions and market data presented here do not reflect real-world trading or market prices. This is a demonstration platform, and the data is simulated.</p>
      </div>
    </div>
  );
};

export default Terms;
