const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

app.use(express.static('public'));


// Endpoint to handle the request
app.post('/send-request', async (req, res) => {
  try {
    // Destructure the data from the request body
    const { method, url, headers, body } = req.body;

    // Send the request using Axios
    const response = await axios({
      method: method,
      url: url,
      headers: headers,
      data: body
    });

    // Send the response back to the client
    res.json({
      status: response.status,
      headers: response.headers,
      data: response.data
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
