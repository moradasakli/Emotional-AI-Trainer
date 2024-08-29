import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';  // Import Filler plugin
import { AuthContext } from '../context/AuthContext';
import { parse } from 'date-fns'; 
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`https://server-phi-fawn.vercel.app/api/history/${auth.username}`);
        console.log('Fetched history (before sorting):', response.data);

        // Parse and sort dates
        const sortedHistory = response.data.sort((a, b) => {
          const dateA = parse(a.date, 'dd/MM/yyyy', new Date());
          const dateB = parse(b.date, 'dd/MM/yyyy', new Date());
          console.log(`Comparing dates - Date A: ${dateA}, Date B: ${dateB}`);
          return dateA - dateB;
        });

        console.log('Sorted history:', sortedHistory);
        setHistoryData(sortedHistory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching history:', error);
        setLoading(false);
      }
    };

    if (auth.username) {
      fetchHistory();
    }
  }, [auth.username]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const dates = historyData.map(entry => entry.date);
  const scores = historyData.map(entry => entry.score_history);

  console.log('Final dates for chart:', dates);
  console.log('Final scores for chart:', scores);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Score History',
        data: scores,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <>
    <Helmet>
      <title>EmotionAI - History</title>
      <link rel="icon" type="image/png" href={logo} sizes="16x16" />
    </Helmet>

    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Score History</h1>
        <Line data={data} />
      </div>
    </div>
    </>
  );
};

export default History;
