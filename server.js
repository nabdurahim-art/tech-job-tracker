const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serves index.html, app.js, style.css from current folder

// Secure Proxy Route to Adzuna API
app.get('/api/jobs', async (req, res) => {
  try {
    // Extract search query parameters from client request or use assignment defaults
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

// Bind to 0.0.0.0 to allow incoming browser/network connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
