const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/getLyrics/:songTitle', async (req, res) => {
  const songTitle = req.params.songTitle;
  const encodedSongTitle = encodeURIComponent(songTitle);

  try {
    const response = await axios.get('https://tools.revesery.com/lyrics/get_lyrics.php', {
      params: {
        songTitle: encodedSongTitle
      }
    });

    const lyrics = response.data;

    // HTML etiketlerini temizleme ve orijinal formatı koruma
    const $ = cheerio.load(lyrics, { xmlMode: false });
    const plainText = $('body').html();

    // Çıktıyı gönderme
    res.send(plainText);
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
