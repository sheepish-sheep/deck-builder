const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());
const PORT = 3000;
const API_URL = 'http://localhost:8000';

// Serve static files from the FrontEnd directory
app.use(express.static(path.join(__dirname, 'FrontEnd')));
// Serve /js from the absolute path to Deck-build/FrontEnd/js
app.use('/js', express.static(path.join(__dirname, 'FrontEnd/js')));

// API proxy endpoint for cards
app.get('/api/cards', async (req, res) => {
    try {
        // Forward query parameters to your FastAPI
        const response = await axios.get(`${API_URL}/cards`, {
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// Get a specific card
app.get('/api/cards/:cardId', async (req, res) => {
    try {
        // Forward query parameters to your FastAPI
        const response = await axios.get(`${API_URL}/cards/${req.params.cardId}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching card details:', error);
        res.status(500).json({ error: 'Failed to fetch card details' });
    }
});

// Get a card by name
app.get('/api/cards/name/:cardName', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/cards/name/${encodeURIComponent(req.params.cardName)}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching card by name:', error);
        res.status(500).json({ error: 'Failed to fetch card by name' });
    }
});

// Get a specific deck
app.get('/decks/:deckId', async (req, res) => {
    console.log('Deck route hit with ID:', req.params.deckId);
    try {
        // Get deck data from Supabase
        // For now, return a simple JSON object
        res.json({
            id: req.params.deckId,
            name: 'My Deck'
        });
    } catch (error) {
        console.error('Error fetching deck details:', error);
        res.status(500).json({ error: 'Failed to fetch deck details' });
    }
});


// Specific route for deck builder
app.get('/deck', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd', 'Deck.html'));
});

// Specific route for login
app.get('/Login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd', 'Login.html'));
});

// Specific route for homepage
app.get('/Homepage.HTML', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd', 'Homepage.HTML'));
});



// Proxy add-card-by-name POST endpoint
app.post('/api/decks/:deckId/add-card-by-name', express.json(), async (req, res) => {
    try {
        const { deckId } = req.params;
        const response = await axios.post(
            `${API_URL}/decks/${deckId}/add-card-by-name`,
            req.body,
            { headers: { ...req.headers, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying add-card-by-name:', error);
        res.status(500).json({ error: 'Failed to add card by name' });
    }
});

// Return 404 JSON for unknown API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve the main HTML file for any other route
app.get('*', (req, res, next) => {
    if (req.path.includes('.')) {
        // If the request looks like a file (has a dot), skip to next middleware (which will 404)
        return next();
    }
    res.sendFile(path.join(__dirname, 'FrontEnd', 'Login.html'));
});

// 404 handler for static files and unknown routes
app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('- /decks/:deckId');
    console.log('- /api/cards');
    console.log('- /api/cards/:cardId');
    console.log('- /deck');
    console.log('- /Login.html');
    console.log('- /Homepage.HTML');
}); 