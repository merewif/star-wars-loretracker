import dayjs from "dayjs";
import { EntryData, YoutiniData } from "../types";
import _ from "lodash";

export async function youtiniParser(
  allBooks: YoutiniData[]
): Promise<EntryData[]> {
  let books: EntryData[] = [];

  for await (const book of allBooks) {
    let currentBook: EntryData = {
      canonicity: book.canonicity,
      coverImage: book["Cover Image URL"],
      title: book["Name (Title)"]!.replace(/—|–|−|-/, "-"),
    };

    currentBook.author = book["Author / Writer"];
    currentBook.releaseDate = dayjs(book["Release Date"]);
    currentBook.category = book["Category"];
    currentBook.links = {};
    currentBook.coverImage = `../imgs/${book["Database ID"]}.jpg`;

    const timelineIncludesTwoDates = /\/|—|–|−|-/.test(book["Timeline"]);

    if (timelineIncludesTwoDates) {
      const fullDate = book["Timeline"]!.replace(/\s|,/g, "").replace(
        /\/|—|–|−/,
        "-"
      );

      let eras = fullDate.match(/([A-Z]{3})/g);
      if (eras!.length === 1) eras![1] = eras![0];
      let dates = fullDate.match(/[^\d]*(\d+)[^\d]*\-[^\d]*(\d+)[^\d]*/);
      dates!.shift();

      if (eras![1] === "BBY") currentBook.timeline = Number(`-${dates![1]}`);
      if (eras![1] === "ABY") currentBook.timeline = Number(`${dates![1]}`);
    }

    if (book["Timeline"]?.endsWith("BBY") && !timelineIncludesTwoDates) {
      currentBook.timeline = Number(
        `-${book["Timeline"].replace(/[^0-9]/g, "")}`
      );
    }

    if (book["Timeline"]?.endsWith("ABY") && !timelineIncludesTwoDates) {
      currentBook.timeline = Number(book["Timeline"].replace(/[^0-9]/g, ""));
    }

    const bookIsEssentialLegends = ["Essential Legends", "Boxed Set"].some(
      (condition) =>
        book["Name (Title)"].toUpperCase().includes(condition.toUpperCase())
    );
    const allowedCategories = [
      "Adult Novel",
      "YA Novel",
      "Junior Reader",
      "Single Issue Comic",
      "Graphic Novel",
      "Omnibus",
    ];

    if (
      allowedCategories.includes(currentBook.category) &&
      !bookIsEssentialLegends
    ) {
      books.push(currentBook);
    }
  }
  const resultsUniqeByTitle = _.uniqBy(books, "title");
  return _.orderBy(resultsUniqeByTitle, "title", "asc");
}
