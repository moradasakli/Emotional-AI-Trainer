import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import logo from '../images/logo.png'; 

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 

  const fetchNews = (query) => {
    if (!query.trim()) {
      return; 
    }

    fetch(`/api/fetchNews?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Parsed data:', data); 
        const articles = data.articles || []; // Adjust to match the NewsAPI response format
        setNewsArticles(articles); 
      })
      .catch(error => console.error('Error fetching news:', error));
  };

  useEffect(() => {
    fetchNews('"manage your emotions" OR "how to manage emotions" OR "emotional management"');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      console.log('Search query is empty. Please enter a valid search term.');
      return;
    }
    fetchNews(searchQuery);
  };

  return (
    <>
      <Helmet>
        <title>EmotionAI - News</title>
        <link rel="icon" type="image/png" href={logo} sizes="16x16" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-0">Latest News on Managing Your Emotions</h1>
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search for news..." 
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300 w-full md:w-auto"
            />
            <button 
              type="submit" 
              className="search-button bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition duration-300"
            >
              Search
            </button>
          </form>
        </div>
        <div>
          {newsArticles.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Loading news...</p>
          ) : (
            newsArticles.filter(article => article.title && article.description && article.urlToImage).reduce((rows, article, index) => {
              if (index % 3 === 0) rows.push([]);
              rows[rows.length - 1].push(article);
              return rows;
            }, []).map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap -mx-4 mb-8">
                {row.map((article, index) => (
                  <div key={index} className="w-full md:w-1/3 px-4">
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                      <img src={article.urlToImage} alt={article.title} className="w-full h-32 object-cover"/>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {article.title}
                          </a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{article.description}</p>
                        <div className="mt-4">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Read more
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default News;
