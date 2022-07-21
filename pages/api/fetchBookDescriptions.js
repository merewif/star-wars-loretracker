const https = require("https");
const fs = require("fs");
const _ = require("lodash");

export default async function handler(req, res) {
  res.send('Hello There!');
  let fetchedData = await fetchBooks();
  let bookData = await parseYoutiniBooks(fetchedData);
  fetchDataRecursively(bookData);
}

async function fetchBooks() {
  let fetchedData = [];
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

    return fetchedData;
}

async function parseYoutiniBooks(fetchedData) {
  let bookData = [];
  for await (const data of _.flatten(fetchedData)) {
    const bookIsEssentialLegends = ["Essential Legends", "Boxed Set"].some((condition) =>
        data["Name (Title)"].toUpperCase().includes(condition.toUpperCase()));
    const allowedCategories = [
      "Adult Novel",
      "YA Novel",
    ];

    if (allowedCategories.includes(data["Category"]) && !bookIsEssentialLegends) {
      bookData.push({
        name: data["Name (Title)"],
        author: data["Author / Writer"],
      });
    }
  }
  return bookData;
}

async function fetchDataRecursively(bookData) {
  let booksNotFound = []
  for (const book of bookData) {
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=star wars ${book.name}+inauthor:${book.author}&langRestrict=en`)
      .then((response) => response.json())
      .then((bookData) => {
        if (!bookData || !bookData?.items || !bookData?.items?.length) {
          logError(book.name);
          booksNotFound.push({ name: book.name, author: book.author });
          return;
        }
        let data = bookData.items[0].volumeInfo;
        data.youtiniTitle = book.name;
        logSearch(book.name, bookData.items[0].volumeInfo.title);
        appendBookDescriptions(data);
      });
  }

  if (booksNotFound.length > 0) {
    fetchDataRecursively(booksNotFound);
  }
}

function logSearch(query, result) {
  console.log(`Search query: star wars ${query}`);
  console.log(`Result: ${result}`);
  console.log("------");
}

function logError(query) {
  console.log(`${query} not found`);
  console.log("------");
}

function appendBookDescriptions(data) {
  const finalData = { youtiniTitle: data.youtiniTitle, foundTitle: data.title, description: data.description };
  const stream = fs.createWriteStream("./public/data/bookDescriptions.txt", { flags: "a" });
  stream.write(JSON.stringify(finalData) + ",");
  stream.end();
}