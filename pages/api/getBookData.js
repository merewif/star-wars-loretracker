const https = require("https");
const fs = require("fs");
const _ = require("lodash");

export default async function handler(req, res) {
  let fetchedData;
  let bookData = [];
  let booksNotFound = [];

  const canonBooks = await fetch("https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Canon%20Books.json");
  const legendBooks = await fetch("https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Legends%20Books.json");

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
    const bookIsEssentialLegends = ["Essential Legends", "Boxed Set"].some((condition) =>
        data["Name (Title)"].toUpperCase().includes(condition.toUpperCase()));
    const allowedCategories = [
      "Adult Novel",
      "YA Novel",
      "Junior Reader",
      "Single Issue Comic",
      "Graphic Novel",
      "Omnibus",
    ];

    if (allowedCategories.includes(data["Category"]) && !bookIsEssentialLegends) {
      bookData.push({
        name: data["Name (Title)"],
        author: data["Author / Writer"],
      });
    }
  }

  res.send('Hello World!');
  for (const book of bookData) {
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=star wars ${book.name}+inauthor:${book.author}&langRestrict=en`)
      .then((response) => response.json())
      .then((googleData) => {
        if (!googleData || !googleData?.items || !googleData?.items?.length) {
          booksNotFound.push(book.name);
          return;
        }
        let data = googleData.items[0].volumeInfo;
        data.youtiniTitle = book.name;
        logSearch(book.name, googleData.items[0].volumeInfo.title);
        appendBookDescriptions(data);
      });
  }

  for (const book of booksNotFound) {
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=star wars ${book}&langRestrict=en`)
      .then((response) => response.json())
      .then((googleData) => {
        if (!googleData || !googleData?.items || !googleData?.items?.length) {
          console.log(`error: ${book} not found`);
          appendErrorFile(book);
          return;
        }
        let data = googleData.items[0].volumeInfo;
        data.youtiniTitle = book;
        logSearch(book, googleData.items[0].volumeInfo.title);
        appendBookDescriptions(data);
      });
  }
}


function logSearch(query, result) {
  console.log(`Search query: star wars ${query}`);
  console.log(`Result: ${result}`);
  console.log("------");
}

function appendBookDescriptions(data){
  const stream = fs.createWriteStream("./public/data/bookDescriptions.txt", { flags: "a" });
  stream.write(JSON.stringify(data) + ",");
  stream.end();
}

function appendErrorFile(bookNotFound){
  const stream = fs.createWriteStream("./public/data/booksNotFound.txt", { flags: "a" });
  stream.write(bookNotFound + "\n");
  stream.end();  
}