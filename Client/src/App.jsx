import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ContactUs from './pages/ContactUs';
import Training from './pages/Training';
import Exam from './pages/Exam';
import News from './pages/News';
import History from './pages/History';  // Import the History page
import { AuthProvider } from './context/AuthContext';  // Import the AuthProvider


function App() {
  return (
    <AuthProvider>  {/* Wrap the app in AuthProvider */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/training" element={<Training />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/news" element={<News />} />
        <Route path="/history" element={<History />} />  {/* Add History route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
