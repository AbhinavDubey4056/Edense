const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data for links
const linkData = {
    "AIML": [{
        title: "Introduction to AI",
        description: "A comprehensive guide to the basics of Artificial Intelligence.",
        url: "https://example.com/ai-intro"
    }, {
        title: "Machine Learning Concepts",
        description: "Learn fundamental machine learning algorithms and concepts.",
        url: "https://example.com/ml-concepts"
    }],
    "Cybersecurity": [{
        title: "Network Security Fundamentals",
        description: "An overview of network security principles and practices.",
        url: "https://example.com/network-security"
    }, {
        title: "Ethical Hacking Tutorial",
        description: "A beginner's guide to ethical hacking.",
        url: "https://example.com/ethical-hacking"
    }],
    "Web Development": [{
        title: "HTML & CSS Crash Course",
        description: "Get started with the building blocks of the web.",
        url: "https://example.com/html-css"
    }]
};

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// API endpoint to get all domains
app.get('/api/domains', (req, res) => {
    res.json(Object.keys(linkData));
});

// API endpoint to get links for a specific domain
app.get('/api/links/:domain', (req, res) => {
    const {
        domain
    } = req.params;
    const links = linkData[domain] || [];
    res.json(links);
});

// API endpoint to add new link (for admin use)
app.post('/api/add-link', (req, res) => {
    const {
        domain,
        title,
        description,
        url
    } = req.body;
    if (domain && title && description && url) {
        if (!linkData[domain]) {
            linkData[domain] = [];
        }
        linkData[domain].push({
            title,
            description,
            url
        });
        res.status(200).json({
            message: 'Link added successfully!'
        });
    } else {
        res.status(400).json({
            message: 'Missing required fields.'
        });
    }
});

// Corrected path to serve static files
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// Fallback for all other routes to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});