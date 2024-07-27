const http = require('http');
const express = require('express');
const config = require('../config');
const socket = require('./lib/socket');

const app = express();
const server = http.createServer(app);

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../client/build')));

server.listen(config.PORT, () => {
  socket(server); // Initialize socket with the server
  console.log('Server is listening at :', config.PORT);
});

const cors = require('cors');
app.use(cors({
  origin: 'https://x-call.onrender.com', // Update with your client's domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
