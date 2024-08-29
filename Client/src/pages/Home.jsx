import React, { useEffect, useState } from 'react';
import SadToHappyImage from '../images/sadtohappy.png'; 
import NewImage from '../images/logo.png'; 
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/home.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleStartTraining = () => {
    window.location.href = '/training';
  };

  if (!data) return <div>Loading...</div>;

  return (


    <>    
    <Helmet>
    <title>EmotionAI - Home</title>
    <link rel="icon" type="image/png" href={logo} sizes="16x16" />
  </Helmet>



    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto py-16 px-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {data.title}
          </h1>
          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
            {data.description}
          </p>
          <div className="mt-8">
            <button
              onClick={handleStartTraining}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg"
            >
              {data.ctaText}
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex items-center justify-center">
          <div className="w-1/2">
            <img src={SadToHappyImage} alt="Sad to Happy transformation" className="rounded-lg shadow-lg" />
          </div>
          <div className="w-1/2 ml-4">
            <img src={NewImage} alt="New Image" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {data.sections.map((section, index) => (
        <div key={index} className="container mx-auto mt-16 px-4">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {section.title}
          </h2>
          {section.title === "What You'll Learn" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {section.items.map((item, index) => {
                // Define specific color classes for each item
                const colors = [
                  {
                    bg: 'bg-purple-100 dark:bg-purple-800',
                    text: 'text-purple-800 dark:text-purple-100',
                    desc: 'text-purple-700 dark:text-purple-200'
                  },
                  {
                    bg: 'bg-blue-100 dark:bg-blue-800',
                    text: 'text-blue-800 dark:text-blue-100',
                    desc: 'text-blue-700 dark:text-blue-200'
                  },
                  {
                    bg: 'bg-green-100 dark:bg-green-800',
                    text: 'text-green-800 dark:text-green-100',
                    desc: 'text-green-700 dark:text-green-200'
                  },
                  {
                    bg: 'bg-yellow-100 dark:bg-yellow-800',
                    text: 'text-yellow-800 dark:text-yellow-100',
                    desc: 'text-yellow-700 dark:text-yellow-200'
                  }
                ];

                const color = colors[index % colors.length];

                return (
                  <div key={index} className={`${color.bg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold ${color.text}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-2 ${color.desc}`}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : section.title !== "Course Reviews" ? (
            <div className="grid grid-cols-1 gap-8 mt-8">
              {section.items.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null }
        </div>
      ))}

      <div className="container mx-auto mt-16 px-4">
        <div className="mt-4 text-gray-700 dark:text-gray-300">
          {data.sections[2].items.map((review, index) => (
            <div key={index} className="mt-4">
              <p className="flex items-center">
                <strong>{review.name}</strong>
                <span className="ml-2 text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}{/* Rating stars represented visually */}
                </span>
                <span className="ml-4 text-gray-500 dark:text-gray-400">({review.date})</span>
              </p>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
