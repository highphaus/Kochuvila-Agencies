// Using native global fetch in Node 24

async function run() {
  try {
    const res = await fetch('https://share.google/q4d6GZbN1tKeH5T91', {
      redirect: 'manual'
    });
    console.log('1:', res.status, res.headers.get('location'));
    const loc1 = res.headers.get('location');
    if (loc1) {
      const res2 = await fetch(loc1, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'manual'
      });
      console.log('2:', res2.status, res2.headers.get('location'));
      const text = await res2.text();
      console.log('Body length:', text.length);
      const urlMatches = text.match(/https?:\/\/[^\s"'<>]+/g);
      console.log('URLs in body:', urlMatches ? urlMatches.slice(0, 10) : 'None');
      const title = text.match(/<title>([^<]+)<\/title>/i);
      console.log('Title:', title ? title[1] : 'None');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
