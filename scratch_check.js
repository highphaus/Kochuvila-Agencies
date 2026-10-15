const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      console.log('URL:', url, '-> Status:', res.statusCode);
      if (res.headers.location) {
        console.log('Location:', res.headers.location);
        get(res.headers.location).then(resolve);
      } else {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          fs.writeFileSync('scratch_result.html', body);
          console.log('Body length:', body.length);
          const title = (body.match(/<title>([^<]+)<\/title>/i) || [])[1];
          console.log('Title:', title);
          resolve(body);
        });
      }
    });
    req.on('error', err => {
      console.error('Error:', err.message);
      resolve(null);
    });
  });
}

get('https://share.google/q4d6GZbN1tKeH5T91');
