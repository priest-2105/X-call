require('dotenv').config(); // Must be at the top

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const PORT = 9000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Xcall Server Active");
});

// Generate JWT Token
app.get("/get-token", (req, res) => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

  console.log('API_KEY:', API_KEY);
  console.log('SECRET_KEY:', SECRET_KEY);

  if (!API_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: "API_KEY or SECRET_KEY not defined in environment variables" });
  }

  const options = { expiresIn: "10m", algorithm: "HS256" };
  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  try {
    const token = jwt.sign(payload, SECRET_KEY, options);
    console.log(`Generated Token: ${token}`);
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Error generating token" });
  }
});


// Create Meeting
app.post("/create-meeting/", (req, res) => {
  const { token, region } = req.body;

  if (!token || !region) {
    return res.status(400).json({ error: "Token and region are required" });
  }

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,  // Ensure the correct prefix
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ region }),
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        });
      }
      return response.json();
    })
    .then((result) => res.json(result))
    .catch((error) => {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: error.message });
    });
});


// Validate Meeting
app.post("/validate-meeting/:meetingId", (req, res) => {
  const token = req.body.token;
  const meetingId = req.params.meetingId;

  if (!token || !meetingId) {
    return res.status(400).json({ error: "Token and meetingId are required" });
  }

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;
  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((result) => res.json(result))
    .catch((error) => {
      console.error("Error validating meeting:", error);
      res.status(500).json({ error: error.message });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});
