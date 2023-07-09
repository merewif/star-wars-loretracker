import https from "https";
import fs from "fs";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { YoutiniData, EntryData } from "../../types";

type Book = {
  name: string;
  author: string;
};

type BookData = {
  youtiniTitle: string;
  foundTitle: string;
  title: string;
  description: string;
};

interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo: {
      title: string;
      description: string;
      youtiniTitle: string;
    };
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.send("Hello There!");
  let fetchedData = await fetchBooks();
  let bookData = await parseYoutiniBooks(fetchedData);
  fetchDataRecursively(bookData);
}

async function fetchBooks(): Promise<Array<Array<YoutiniData>>> {
  let fetchedData: Array<Array<YoutiniData>> = [];
  const canonBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Canon%20Books.json",
  );
  const legendBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Legends%20Books.json",
  );

  await Promise.all([canonBooks, legendBooks])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          return response.json();
        }),
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

async function parseYoutiniBooks(
  fetchedData: Array<Array<YoutiniData>>,
): Promise<Book[]> {
  let bookData: Book[] = [];
  for await (const data of _.flatten(fetchedData)) {
    const bookIsEssentialLegends = ["Essential Legends", "Boxed Set"].some(
      (condition) =>
        data["Name (Title)"].toUpperCase().includes(condition.toUpperCase()),
    );
    const allowedCategories = ["Adult Novel", "YA Novel"];

    if (
      allowedCategories.includes(data["Category"]) &&
      !bookIsEssentialLegends
    ) {
      bookData.push({
        name: data["Name (Title)"],
        author: data["Author / Writer"],
      });
    }
  }
  return bookData;
}
function logSearch(query: string, result: string) {
  console.log(`Search query: star wars ${query}`);
  console.log(`Result: ${result}`);
  console.log("------");
}

function logError(query: string) {
  console.log(`${query} not found`);
  console.log("------");
}

async function fetchDataRecursively(bookData: Book[]) {
  let booksNotFound: Book[] = [];
  for (const book of bookData) {
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=star wars ${book.name}+inauthor:${book.author}&langRestrict=en`,
    )
      .then((response) => response.json())
      .then((bookData: GoogleBooksResponse) => {
        if (!bookData || !bookData?.items || !bookData?.items?.length) {
          logError(book.name);
          booksNotFound.push({ name: book.name, author: book.author });
          return;
        }
        let data = bookData.items[0].volumeInfo;
        data["youtiniTitle"] = book.name;
        logSearch(book.name, bookData.items[0].volumeInfo.title);
        appendBookDescriptions({
          youtiniTitle: book.name,
          foundTitle: bookData.items[0].volumeInfo.title,
          title: bookData.items[0].volumeInfo.title,
          description: bookData.items[0].volumeInfo.description,
        });
      });
  }

  if (booksNotFound.length > 0) {
    fetchDataRecursively(booksNotFound);
  }
}

function appendBookDescriptions(data: BookData) {
  const finalData: BookData = {
    youtiniTitle: data.youtiniTitle,
    foundTitle: data.foundTitle,
    title: data.title,
    description: data.description,
  };
  const stream = fs.createWriteStream("./public/data/bookDescriptions.txt", {
    flags: "a",
  });
  stream.write(JSON.stringify(finalData) + ",");
  stream.end();
}
