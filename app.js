const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use('/mangadex-better-random', express.static('./mangadex-better-random'))
app.use('/tmp', express.static('./tmp'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/images', async (req, res) => {
  let filepath = await downloadImage(req.body.url, `tmp/cover.jpg`);
  res.send(JSON.stringify({
      url: `${filepath}`
  }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const fs = require('fs');
const client = require('https');

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}