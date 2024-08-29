import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import axios
import '../Exam.css';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext for current user
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState(null);
  const [lowestCategoryInfo, setLowestCategoryInfo] = useState(null); // State for lowest category info
  const { auth } = useContext(AuthContext); // Correctly access username from context

  useEffect(() => {
    // Reset state when component mounts or when retaking the exam
    setQuestions([]);
    setOptions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCategories([]);
    setResults(null);
    setLowestCategoryInfo(null);

    // Fetch the questions and options from exam.json
    fetch('/exam.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions);
        setOptions(data.options);
        const uniqueCategories = [...new Set(data.questions.map(q => q.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error loading questions:', error));
  }, []); // Empty dependency array to run only on mount

  const handleAnswerClick = (grade) => {
    setAnswers({ ...answers, [currentQuestionIndex]: grade });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishExam = async () => {
    if (!auth.username) {
      console.error('Username is undefined');
      return;
    }

    try {
      const categoryScores = {};
      categories.forEach(category => {
        const categoryQuestions = questions.filter(q => q.category === category);
        const totalQuestions = categoryQuestions.length;
        const totalScore = categoryQuestions.reduce((sum, question) => {
          const questionIndex = questions.indexOf(question);
          return sum + (answers[questionIndex] || 0);
        }, 0);
        const maxScore = totalQuestions * options[0].grade;
        const percentage = (totalScore / maxScore) * 100;
        categoryScores[category] = percentage.toFixed(2);
      });

      const overallAverage = Object.values(categoryScores).reduce((sum, score) => sum + parseFloat(score), 0) / categories.length;

      setResults({ categoryScores, overallAverage: overallAverage.toFixed(2) });

      // Identify the lowest and second-lowest categories, excluding "Other" if it's the lowest
      const sortedCategories = Object.entries(categoryScores).sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]));
      let lowestCategoryName = sortedCategories[0][0].toLowerCase().replace(/\s+/g, ''); // Convert to lowercase and remove spaces

      if (lowestCategoryName === 'other') {
        lowestCategoryName = sortedCategories[1][0].toLowerCase().replace(/\s+/g, ''); // Use the second-lowest if "Other" is the lowest
      }

      console.log(`Fetching JSON file for category: ${lowestCategoryName}`); // Debugging log

      // Fetch the JSON file for the lowest or second-lowest category
      try {
        const response = await fetch(`/categoryInfo/${lowestCategoryName}.json`);
        if (!response.ok) {
          throw new Error(`JSON file not found for category: ${lowestCategoryName}`);
        }
        const data = await response.json();
        setLowestCategoryInfo(data); // Set the lowest category info
        console.log(`Data fetched successfully for category: ${lowestCategoryName}`, data);
      } catch (error) {
        console.error('Error fetching category info:', error);
      }

      // Save exam results to the database using axios
      try {
        const response = await axios.post('https://server-phi-fawn.vercel.app/api/submit-exam', {
          username: auth.username, // Make sure username is not undefined here
          overallAverage: parseFloat(overallAverage.toFixed(2)),
        });

        if (response.status === 201) {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error('Error submitting exam results:', error.response?.data?.message || error.message);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCategoryIndex = (category) => categories.indexOf(category) + 1;

  if (questions.length === 0 || options.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>    
    <Helmet>
      <title>EmotionAI - Exam</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>

    <div className="exam-container">
      <div className="progress-bar">
        <div className="progress-track"></div>
        {categories.map((category, index) => {
          const firstQuestionIndexInCategory = questions.findIndex(q => q.category === category);
          const isCompleted = currentQuestionIndex > firstQuestionIndexInCategory;
          const isActive = currentQuestionIndex >= firstQuestionIndexInCategory && currentQuestionIndex < firstQuestionIndexInCategory + questions.filter(q => q.category === category).length;

          return (
            <div
              key={index}
              className={`progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="progress-step-circle">{index + 1}</div>
              <div className="progress-step-text">{category}</div>
            </div>
          );
        })}
      </div>

      <div className="question-section">
        {results ? (
          <div className="results-section">
            <h2>Results</h2>
            {Object.entries(results.categoryScores)
              .filter(([category]) => category !== "Other") // Filter out "Other" category
              .map(([category, score], index) => (
                <div className="result-bar" key={category}>
                  <div className="result-bar-title">{category}</div>
                  <div className="result-bar-track">
                    <div
                      className={`result-bar-fill result-bar-fill-${index}`} // Add a unique class for each bar
                      style={{ width: `${score}%` }}>
                      <span className="result-bar-label">{score}%</span>
                    </div>
                  </div>
                </div>
              ))}

            {/* Overall average circle */}
            <div className="overall-average-container">
              <div className="overall-score-label">Overall Score</div> {/* Label above the circle */}
              <div className="circular-progress" style={{ '--percentage': `${results.overallAverage}%` }}>
                <div className="overall-average-text">{results.overallAverage}%</div>
              </div>
            </div>

            {/* Display additional information for the lowest category */}
            {lowestCategoryInfo && (
              <div className="lowest-category-info">
                <h3 style={{ color: '#00796b' }}>{lowestCategoryInfo.title1}</h3> {/* Changed color */}
                <p>{lowestCategoryInfo.content1}</p>
                <h3 style={{ color: '#00796b' }}>{lowestCategoryInfo.title2}</h3> {/* Changed color */}
                <p>{lowestCategoryInfo.content2}</p>
                <h3 style={{ color: '#00796b' }}>{lowestCategoryInfo.title3}</h3> {/* Changed color */}
                <ul>
                  {/* Split content3 into separate questions */}
                  {lowestCategoryInfo.content3.split('\n').map((question, index) => (
                    <li key={index}>{question.trim()}</li> // Trim whitespace and display each question in a list
                  ))}
                </ul>
                {/* Display the new title4 content */}
                <h3 style={{ marginTop: '20px', color: '#d32f2f' }}>{lowestCategoryInfo.title4}</h3>
              </div>
            )}

          </div>
        ) : (
          <>
            <p>{questions[currentQuestionIndex].text}</p>
            <div className="options">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${answers[currentQuestionIndex] === option.grade ? 'selected' : ''}`}
                  onClick={() => handleAnswerClick(option.grade)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              {currentQuestionIndex > 0 && (
                <button onClick={previousQuestion}>Previous</button>
              )}
              {answers[currentQuestionIndex] !== undefined && currentQuestionIndex < questions.length - 1 && (
                <button className="next-button" onClick={nextQuestion}>Next</button>
              )}
              {answers[currentQuestionIndex] !== undefined && currentQuestionIndex === questions.length - 1 && (
                <button onClick={finishExam}>Finish</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Exam;
