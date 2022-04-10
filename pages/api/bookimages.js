const https = require('https');
const fs = require('fs');
const _ = require('lodash');

const downloadFile = (name, url) => {
  // Commented out to avoid unnecessary download requests.
  //
  // const file = fs.createWriteStream(
  //   `./public/imgs/fetchedimgs/bookimages/${name
  //     .replace(/[^a-z0-9]/gi, '_')
  //     .toLowerCase()}`,
  //   { flags: 'wx' }
  // );
  // const request = https.get(url, (response) => {
  //   response.pipe(file);
  //   file.on('finish', () => {
  //     console.log(`${name} downloaded.`);
  //     file.close();
  //   });
  // });
};

export default async function handler(req, res) {
  let fetchedData;
  let images = [];

  const canonBooks = await fetch(
    'https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Canon%20Books.json'
  );
  const legendBooks = await fetch(
    'https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Legends%20Books.json'
  );

  await Promise.all([canonBooks, legendBooks])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          return response.json();
        })
      );
    })
    .then((datas) => {
      fetchedData = datas;
    })
    .catch((error) => {
      throw error;
    });

  for await (const data of _.flatten(fetchedData)) {
    images.push({
      name: data['Name (Title)'],
      image: data['Cover Image URL'],
    });
  }

  let count = 0;
  setInterval(() => {
    if (count > images.length) return;
    downloadFile(images[count].name, images[count].image);
    count++;
  }, 250);

  console.log(images.length);
  res.json(images);
}
