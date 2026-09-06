const http = require('http');

const data = JSON.stringify({
  message: "Hi, what festivals are today?",
  history: [{ role: 'user', parts: [{ text: "Hello" }] }, { role: 'model', parts: [{ text: "Nomoskar! I am Purohit-mosai." }] }],
  festival: "Durga Puja 2026"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Chat Endpoint Status:', res.statusCode);
    console.log('Chat Endpoint Response:', responseData);
  });
});

req.on('error', error => {
  console.error('Error hitting chat endpoint:', error.message);
});

req.write(data);
req.end();
