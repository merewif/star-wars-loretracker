const https = require('https');
const fs = require('fs');
const _ = require('lodash');

const downloadFile = (name, url) => {
  // Commented out to avoid unnecessary download requests.
  //
  // const file = fs.createWriteStream(
  //   `./public/imgs/fetchedimgs/comicimages/${name
  //     .replace(/[^a-z0-9]/gi, '_')
  //     .toLowerCase()}.jpg`,
  //   { flags: 'wx' }
  // );
  // const options = { host: url.toString(), timeout: 1000 };
  // const request = https.get(options, (response) => {
  //   response.pipe(file);
  //   file.on('finish', () => {
  //     file.close();
  //   });
  // });
  // request.on('socket', (s) => {
  //   s.setTimeout(100, () => {
  //     s.destroy();
  //   });
  // });
};

export default async function handler(req, res) {
  let fetchedData;
  let images = [];

  const canonComics = await fetch(
    'https://star-wars-loretracker.vercel.app/data/comics/Youtini%20Bookshelf%20-%20Canon%20Comics.json'
  );
  const legendComicsABY = await fetch(
    'https://star-wars-loretracker.vercel.app/data/comics/Youtini%20Bookshelf%20-%20Legends%20Comics%20(ABY).json'
  );
  const legendComicsBBY = await fetch(
    'https://star-wars-loretracker.vercel.app/data/comics/Youtini%20Bookshelf%20-%20Legends%20Comics%20(BBY).json'
  );

  await Promise.all([canonComics, legendComicsABY, legendComicsBBY])
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

  res.json(images);
}
