const https = require('https');

const data = JSON.stringify({
  sha: '4bc42e3eb4d89f71986ec5d6855d61a14804ede3',
  force: true
});

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/qwerewqwerew/cbot/git/refs/heads/main',
  method: 'PATCH',
  headers: {
    'Authorization': 'token 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',
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'node.js',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
