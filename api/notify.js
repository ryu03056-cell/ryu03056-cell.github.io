export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { title, body, url } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title, body required' });

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ['Total Subscriptions'],
        headings: { ko: title, en: title },
        contents: { ko: body, en: body },
        url: url || 'https://ryu03056-cell.github.io'
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
