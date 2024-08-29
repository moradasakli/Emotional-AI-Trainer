import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style.css'; // Global styles
import signInImage from '../images/signIn.jpeg'; // Import the image
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://server-phi-fawn.vercel.app/api/signin', {
        username,
        password,
      });

      if (response.status === 200) {
        setAuth({ username: response.data.username, score: response.data.score });
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Sign-in failed');
    }
  };

  return (
    <>
    <Helmet>
      <title>EmotionAI - SignIn</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>

    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md flex flex-col lg:flex-row items-center justify-between">
        {/* Left Column - Sign In Form */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Centered Title and Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Sign In</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Please enter your details</p>
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
              <label className="block text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              {/* Register link */}
              <a href="/register" className="text-green-500 hover:underline">Register</a>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300">
              Sign In
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img src={signInImage} alt="Sign In" className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
    </>
  );
};

export default SignIn;
