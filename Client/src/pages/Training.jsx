import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const Training = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(-1); // Start with -1 to show the intro screen
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch exercises from JSON file
  useEffect(() => {
    fetch('/exercises.json') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched exercises:', data);  // Log fetched data
        setExercises(data);
        setLoading(false); // End loading
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
      });
  }, []);

  // Start training by setting the current exercise to the first one
  const startTraining = () => {
    console.log('Start Training clicked');
    setCurrentExercise(0);  // Set to the first exercise
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    } else {
      setCurrentExercise(-1);  // Go back to the intro screen
    }
  };

  return (

    <>
    <Helmet>
      <title>EmotionAI - Training</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>

    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-4">

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="loading-screen flex items-center justify-center h-screen"
          >
            <div className="loader animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
          </motion.div>
        ) : currentExercise === -1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="intro-screen text-center"
          >
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
              Emotional Intelligence Training
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Enhance your emotional intelligence with exercises designed to promote self-awareness, emotional regulation, and social connection.
            </p>
            <p className="text-md text-gray-600 dark:text-gray-300 mb-8">
              Through consistent training, you'll learn how to recognize, understand, and manage your emotions effectively. This training program includes mindfulness exercises, relaxation techniques, and emotional regulation practices to enhance your emotional intelligence.
            </p>
            <p className="text-md text-gray-600 dark:text-gray-300 mb-8">
              The exercises will guide you step by step in enhancing your ability to respond to emotions constructively and build healthier relationships. Press "Start Training" to begin your emotional journey.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-lg"
                onClick={startTraining}
              >
                Start Training
              </button>
            </div>
          </motion.div>
        ) : (
          exercises.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="exercise-screen"
            >
              {/* Video or Image at the Top */}
              <div className="flex justify-center mb-8">
                <div 
                  dangerouslySetInnerHTML={{ __html: exercises[currentExercise].videoEmbed }} 
                  className="rounded-lg overflow-hidden shadow-md max-w-full mx-auto text-center"
                  style={{ maxWidth: '100%', height: 'auto' }} // Ensures the video stays responsive and centered
                />
              </div>

              <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                {exercises[currentExercise].title}
              </h2>

              {/* Container for the content */}
              <div className="big-container bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
                
                {/* Description Section */}
                <div className="section-container bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Description</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: exercises[currentExercise].description }} 
                    className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                {/* How to Practice Section */}
                <div className="section-container bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">How to Practice</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: exercises[currentExercise].howToPractice || 'No How to Practice content available.' }} 
                    className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                {/* Benefits Section */}
                <div className="section-container bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Benefits</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: exercises[currentExercise].benefits || 'No Benefits content available.' }} 
                    className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

              </div>

              {/* Navigation Buttons */}
              <div className="navigation flex justify-between mt-6">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  onClick={previousExercise}
                >
                  Previous
                </button>
                <button
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ${currentExercise === exercises.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                >
                  Next
                </button>
              </div>

            </motion.div>
          )
        )}
      </div>
    </div>
    </>
  );
};

export default Training;
