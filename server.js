const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets (index.html, styles.css, app.js) safely from the root directory
// 'dotfiles: ignore' ensures files like .env cannot be accessed via the browser
app.use(express.static(__dirname, { dotfiles: 'ignore' }));

// Explicit route to serve the main HTML dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Secure Proxy Route to Adzuna API
app.get('/api/jobs', async (req, res) => {
  try {
    // Extract search query parameters from client request or use defaults
    const what = req.query.what || 'developer';
    const where = req.query.where || 'london';
    const page = req.query.page || 1;

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      return res.status(500).json({ 
        error: 'Missing Adzuna API credentials in .env file' 
      });
    }

    // Construct external API request
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=12&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}`;

    const apiResponse = await fetch(adzunaUrl);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ 
        error: `Adzuna API Error: ${apiResponse.status}`,
        details: errorText
      });
    }

    const data = await apiResponse.json();
    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error while fetching jobs' });
  }
});

// Bind to 0.0.0.0 to handle incoming browser & network traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
