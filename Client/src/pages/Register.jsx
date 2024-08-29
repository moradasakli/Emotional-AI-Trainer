import React, { useState } from 'react';
import axios from 'axios';
import signInImage from '../images/signIn.jpeg'; // Import the image
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://server-phi-fawn.vercel.app/api/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(true);
        setError(null);
        console.log('Registration successful:', response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setSuccess(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>EmotionAI - Register</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>

    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md flex flex-col lg:flex-row items-center justify-between">
        {/* Left Column - Registration Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Centered Title and Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Register</h1>
            <p className="text-gray-600 dark:text-gray-400">Create your account by entering your details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Username</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300">
              Register
            </button>
          </form>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">Registration successful!</p>}
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img src={signInImage} alt="Register" className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
