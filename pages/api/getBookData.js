const https = require("https");
const fs = require("fs");
const _ = require("lodash");

const downloadFile = (jsonData) => {
  let dataString =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(jsonData));
  let anchorElement = document.getElementById("downloadAnchorElem");
  anchorElement.setAttribute("href", dataString);
  anchorElement.setAttribute("download", "StarWarsBooksData.json");
  anchorElement.click();
};

export default async function handler(req, res) {
  let fetchedData;
  let bookData = [];
  let googleBookData = {};

  const canonBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Canon%20Books.json"
  );
  const legendBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Legends%20Books.json"
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
    bookData.push({
      name: data["Name (Title)"],
      image: data["Cover Image URL"],
    });
  }

  let count = 0;
  setInterval(() => {
    if (count > bookData.length) return;
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookData[count].name}`
    )
      .then((response) => response.json())
      .then((googleData) => {
        if (!googleData || !googleData.items[0]) {
          return;
        }

        googleBookData[bookData[count].name] = {
          title: googleData.items[0].title,
          description: googleData.items[0].description,
          industryIdentifiers: googleData.items[0].industryIdentifiers,
        };
      });
    count++;
  }, 250);

  console.log(bookData.length);
  downloadFile(googleBookData)
  res.json([googleBookData]);
}
