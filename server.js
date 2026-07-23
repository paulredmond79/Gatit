const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = process.env.DATA_DIR || '/data';
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// Trust the Caddy reverse proxy (private/internal network ranges) so req.ip
// reflects the real client, matching the previous nginx real_ip config.
app.set('trust proxy', ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16']);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function saveState(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

let state = loadState();
if (!state || !state.since) {
  state = { since: new Date().toISOString() };
  saveState(state);
}

app.get('/api/status', (req, res) => {
  res.json({ since: state.since });
});

app.post('/api/reset', (req, res) => {
  state = { since: new Date().toISOString() };
  saveState(state);
  res.json({ since: state.since });
});

app.listen(PORT, () => {
  console.log(`Gatit listening on port ${PORT}`);
});
