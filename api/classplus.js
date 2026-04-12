// api/classplus.js
const axios = require('axios');

module.exports = async (req, res) => {
  // ब्राउज़र की गलत रिक्वेस्ट को रोकने के लिए
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url, token } = req.query;

  if (!url || !token) {
    return res.status(400).json({ error: 'URL और Token ज़रूरी हैं' });
  }

  try {
    // ClassPlus के असली API से बात करेंगे
    const response = await axios.get('https://api.classplusapp.com/cams/uploader/video/jw-signed-url', {
      headers: {
        'host': 'api.classplusapp.com',
        'x-access-token': token,
        'accept-language': 'EN',
        'api-version': '18',
        'app-version': '1.4.73.2',
        'device-details': 'Xiaomi_Redmi 7_SDK-32',
        'device-id': 'c28d3cb16bbdac01',
        'user-agent': 'Mobile-Android'
      },
      params: { url: url }
    });

    const mpd = response.data.url;
    const key = response.data.key;

    res.status(200).json({
      mpd: mpd,
      keys: key ? [key] : []
    });

  } catch (error) {
    res.status(500).json({ error: 'कुछ गड़बड़ हुई' });
  }
};
