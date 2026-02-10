const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Store leads in memory (for demo purposes)
let leads = [];

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to receive leads from n8n (or Vapi directly)
app.post('/api/leads', (req, res) => {
    const lead = req.body;
    console.log('Received Lead:', lead);

    // Add timestamp if not present
    if (!lead.timestamp) {
        lead.timestamp = new Date().toISOString();
    }

    leads.unshift(lead); // Add to top
    res.json({ status: 'success', message: 'Lead received' });
});

// Endpoint for the dashboard to get leads
app.get('/api/leads', (req, res) => {
    res.json(leads);
});

// Proxy endpoint to fetch Google Sheet data (bypasses CORS)
const SHEET_ID = '1uq4wQ-SH_iXvfRioBG9A8edMsGoMWIzIgoinJ-q0heQ';
app.get('/api/sheet-leads', async (req, res) => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
        const response = await fetch(url);
        const text = await response.text();

        // Strip JSONP wrapper: "/*O_o*/\ngoogle.visualization.Query.setResponse({...});"
        // Find the opening paren of setResponse( and the closing );
        const startIdx = text.indexOf('setResponse(') + 'setResponse('.length;
        const endIdx = text.lastIndexOf(');');
        const jsonStr = text.substring(startIdx, endIdx);
        const json = JSON.parse(jsonStr);

        // Parse rows into clean objects
        const cols = json.table.cols.map(c => c.label || '');
        console.log('Sheet columns:', cols);

        const sheetLeads = json.table.rows.map(row => {
            const c = row.c;
            // Actual columns: A=name, B=contact, C=time, D=intrest
            return {
                name: c[0] ? (c[0].f || String(c[0].v)) : '',
                phone: c[1] ? (c[1].f || String(c[1].v)) : '',
                timestamp: c[2] ? (c[2].f || String(c[2].v)) : new Date().toISOString(),
                interest: c[3] ? (c[3].f || String(c[3].v)) : '',
                source: 'Google Sheet'
            };
        });

        console.log(`Fetched ${sheetLeads.length} leads from Google Sheet`);
        res.json(sheetLeads);
    } catch (err) {
        console.error('Error fetching Google Sheet:', err.message);
        res.json([]);
    }
});

// Serve the admin dashboard
app.get('/admin', (req, res) => {
    res.redirect('/admin.html');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`- Demo Site: http://localhost:${PORT}`);
    console.log(`- Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`- Webhook Endpoint: http://localhost:${PORT}/api/leads (expose this via ngrok)`);
});
