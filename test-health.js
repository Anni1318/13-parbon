const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health/gemini',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Health Endpoint Status:', res.statusCode);
    console.log('Health Endpoint Response:', data);
  });
});

req.on('error', error => {
  console.error('Error hitting health endpoint:', error.message);
});

req.end();
