import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { AuthContext } from '../context/AuthContext';
import '../style.css'; // Global styles

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? true : false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the hamburger menu
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getIcon = (score) => {
    if (typeof score !== 'number') {
      score = Number(score);
    }
    if (score === 0) return '❤️'; 
    if (score >= 10 && score <= 20) return '😢'; 
    if (score >= 21 && score <= 40) return '😞'; 
    if (score >= 41 && score <= 60) return '😟'; 
    if (score >= 61 && score <= 80) return '🙂'; 
    if (score >= 81 && score <= 100) return '😃'; 
    return '😶'; 
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu open state
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-all duration-300 w-full">
      <div className="container mx-auto px-4 flex justify-between items-center py-4 w-full">
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src={logo} alt="EmotionAI Trainer Logo" className="h-10 mr-3 transform hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">EmotionAI Trainer</span>
          </Link>
          {auth.username && (
            <span className="ml-4 text-gray-800 dark:text-gray-200 flex items-center whitespace-nowrap">
              Hello, {auth.username}
              <span className="ml-2">{getIcon(auth.score)}</span>
            </span>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-800 dark:text-gray-200 focus:outline-none text-2xl"
        >
          ☰
        </button>

        {/* Navbar Links with Slide Animation */}
        <div className={`lg:flex items-center transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-auto absolute lg:relative top-0 left-0 lg:left-auto lg:top-auto lg:flex-row flex-col lg:flex-row w-full h-screen lg:h-auto bg-white dark:bg-gray-800 lg:bg-transparent dark:lg:bg-transparent lg:space-x-4`}>
          <div className="flex flex-col lg:flex-row items-center lg:space-x-4">
            <Link to="/" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">Home</Link>
            <Link to="/news" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">News</Link>
            <Link to="/contactus" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">Contact Us</Link>
            {auth.username && (
              <Link to="/exam" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">Exam</Link>
            )}
            <Link to="/training" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">Training</Link>
            {auth.username && (
              <Link to="/history" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">History</Link>
            )}
          </div>

          {/* Auth and Theme Toggle */}
          <div className="flex flex-col lg:flex-row items-center lg:space-x-4 mt-4 lg:mt-0">
            {!auth.username && (
              <>
                <Link to="/signin" onClick={closeMenu} className="text-green-600 dark:text-green-400 hover:text-green-500 font-bold transition-colors duration-300 hover:bg-green-100 dark:hover:bg-green-700 py-2 px-4 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={closeMenu} className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">Register</Link>
              </>
            )}
            {auth.username && (
              <button onClick={() => { handleLogout(); closeMenu(); }} className="text-red-600 dark:text-red-400 hover:text-red-500 font-bold transition-colors duration-300 hover:bg-red-100 dark:hover:bg-red-700 py-2 px-4 rounded-lg">Logout</button>
            )}
            <button onClick={toggleTheme} className="text-gray-800 dark:text-gray-200 focus:outline-none text-2xl transform hover:rotate-20 transition-transform duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
