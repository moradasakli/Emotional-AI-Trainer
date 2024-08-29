import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    from_name: '', // Matches the {{from_name}} variable in your template
    message: '',   // Matches the {{message}} variable in your template
    to_name: 'Morad Asakli', // Matches the {{to_name}} variable in your template
    reply_to: '',  // Matches the {{reply_to}} variable
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_zldmn7x', // Your Service ID
      'template_zvga8jq', // Your Template ID
      formData,
      '24VcizBDFHgHMG0RS' // Your User ID (Public Key)
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setStatus('SUCCESS');
        setFormData({ from_name: '', message: '', to_name: 'Morad Asakli', reply_to: '' }); // Clear the form
      })
      .catch((err) => {
        console.error('EmailJS error:', err.response || err); // Log full error response for debugging
        setStatus('FAILED');
      });
    
  };

  return (
    <>

    <Helmet>
      <title>EmotionAI - ContactUs</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>





    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Contact Us</h1>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              type="text"
              name="from_name" // Updated to match your template variable
              value={formData.from_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 dark:text-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Your Email</label>
            <input
              type="email"
              name="reply_to" // Updated to match the reply_to variable in your template
              value={formData.reply_to}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 dark:text-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              name="message" // Updated to match your template variable
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 dark:text-white dark:bg-gray-700"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
        {status === 'SUCCESS' && <p className="text-green-500 mt-4">Message sent successfully!</p>}
        {status === 'FAILED' && <p className="text-red-500 mt-4">Failed to send message. Please try again.</p>}
      </div>
    </div>
    </>
  );
};

export default ContactUs;
