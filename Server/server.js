const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;  // Use the environment variable

let dbClient; // Declare a variable to store the database client

// Middleware
app.use(cors());
app.use(express.json());

const connectToDatabase = async () => {
  if (!dbClient) {
    dbClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await dbClient.connect();
  }
  return dbClient;
};

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const client = await connectToDatabase();
    const database = client.db('G14');
    const users = database.collection('users');

    // Check if the user already exists
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Insert the new user into the database with a default score of 0
    await users.insertOne({ username, email, password, score: 0 });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign-in route
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = await connectToDatabase();
    const database = client.db('G14');
    const users = database.collection('users');

    // Find the user by username
    const user = await users.findOne({ username });

    // If user doesn't exist or password doesn't match, return error
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Successful sign-in response with token and score
    res.status(200).json({ message: 'Sign-in successful', username: user.username, token: 'some_token', score: user.score });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// History route
app.get('/api/history/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const client = await connectToDatabase();
    const database = client.db('G14');
    const historyCollection = database.collection('history');

    // Fetch the user's history from the database
    const history = await historyCollection.find({ username }).toArray();

    res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API endpoint to save the exam results
app.post('/api/submit-exam', async (req, res) => {
  console.log('Submit Exam request received:', req.body); // Log the incoming request

  const { username, overallAverage } = req.body;
  const currentDate = new Date().toLocaleDateString('en-GB'); // Format date as "dd/mm/yy"

  try {
    const client = await connectToDatabase();
    const database = client.db('G14');
    const usersCollection = database.collection('users');
    const historyCollection = database.collection('history');

    // Log before updating the score
    console.log('Updating score for user:', username);

    // Update the user's score in the users collection
    const updateResult = await usersCollection.updateOne(
      { username }, // Filter by username
      { $set: { score: overallAverage } } // Update the score
    );

    if (updateResult.matchedCount === 0) {
      console.error('User not found:', username);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log before inserting history entry
    console.log('Inserting history entry for user:', username);

    // Create a new history entry
    const newHistoryEntry = {
      username,
      score_history: overallAverage,
      date: currentDate,
    };

    // Insert the new history entry into the collection
    const result = await historyCollection.insertOne(newHistoryEntry);

    if (result.acknowledged) {
      console.log('Exam results saved successfully for user:', username);
      res.status(201).json({ message: 'Exam results saved successfully!' });
    } else {
      console.error('Failed to save exam results for user:', username);
      res.status(500).json({ message: 'Failed to save exam results.' });
    }
  } catch (error) {
    console.error('Error saving exam results:', error);
    res.status(500).json({ message: 'Failed to save exam results.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
