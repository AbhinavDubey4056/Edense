const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory "database" to store links
const linkData = {
    'aiml': {
        name: 'AI & Machine Learning',
        links: [
            { title: 'Coursera ML Course by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning' },
            { title: 'Sentdex - Python for ML Tutorials', url: 'https://www.youtube.com/user/sentdex' },
            { title: 'Hugging Face for NLP', url: 'https://huggingface.co/' }
        ]
    },
    'cybersec': {
        name: 'Cybersecurity',
        links: [
            { title: 'TryHackMe - Learn Penetration Testing', url: 'https://tryhackme.com/' },
            { title: 'TCM Security - Practical Ethical Hacking', url: 'https://www.youtube.com/c/TCMSecurity' },
            { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' }
        ]
    },
    'webdev': {
        name: 'Web Development',
        links: [
            { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web' },
            { title: 'The Odin Project', url: 'https://www.theodinproject.com/' },
            { title: 'Tailwind CSS Documentation', url: 'https://tailwindcss.com/docs' }
        ]
    },
    'pytorch': {
        name: 'Pytorch',
        links: [
            {title: 'Free Course', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA&t=17175s'}
        ]
    }
};

// Serve static files from the 'public' directory
// This must be placed before all other routes.
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoint to get all domains and links
app.get('/api/domains', (req, res) => {
    res.json(linkData);
});

// API Endpoint to add a new link (for admin use)
app.post('/api/add-link', (req, res) => {
    const { domain, title, url } = req.body;

    if (!linkData[domain]) {
        return res.status(404).json({ error: 'Domain not found.' });
    }

    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required.' });
    }

    linkData[domain].links.push({ title, url });
    res.status(201).json({ message: 'Link added successfully.' });
});

// Fallback for all other requests. This is the catch-all route.
// Using a regex to fix the PathError with older Express versions.
app.get(/\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

