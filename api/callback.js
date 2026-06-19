export default async function handler(req, res) {
  const { code } = req.query;
  
  // Exchanges the login code for an access token using your Vercel secrets
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  
  const data = await response.json();
  const token = data.access_token;
  
  // Sends the secure token back to Sveltia CMS to unlock the dashboard
  const script = `
    <script>
      const message = { token: "${token}", provider: "github" };
      window.opener.postMessage("authorization:github:success:" + JSON.stringify(message), "*");
      window.close();
    </script>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(script);
}
