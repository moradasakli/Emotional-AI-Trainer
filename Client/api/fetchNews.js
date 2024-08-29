// /api/fetchNews.js
export default async function handler(req, res) {
    const { query } = req.query;
    const apiKey = process.env.NEWS_API_KEY; // Ensure the environment variable is correctly set
  
    if (!apiKey) {
      console.error('API key is missing or not set.');
      return res.status(500).json({ error: 'API key is missing or not set.' });
    }
  
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error fetching news from API:', errorData);
        return res.status(response.status).json({ error: 'Failed to fetch news from API.' });
      }
  
      const data = await response.json();
      res.status(200).json(data); // Send news data to client
    } catch (error) {
      console.error('Error fetching news:', error.message);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
  