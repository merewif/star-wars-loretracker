import { EntryData, YoutiniData } from '../types';

export async function useYoutiniFetch(
  parameter: string
): Promise<YoutiniData[]> {
  let fetchedData: YoutiniData[] = [];

  if (parameter === 'books') {
    await fetch('./data/books/Youtini Bookshelf - Legends Books.json')
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          fetchedData.push(entry);
        }
      });

    await fetch('./data/books/Youtini Bookshelf - Canon Books.json')
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = true;
          fetchedData.push(entry);
        }
      });
  }

  if (parameter === 'comics') {
    await fetch('./data/comics/Youtini Bookshelf - Canon Comics.json')
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = true;
          fetchedData.push(entry);
        }
      });

    await fetch('./data/comics/Youtini Bookshelf - Legends Comics (ABY).json')
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          fetchedData.push(entry);
        }
      });

    await fetch('./data/comics/Youtini Bookshelf - Legends Comics (BBY).json')
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          fetchedData.push(entry);
        }
      });
  }

  return Promise.resolve(fetchedData);
}
