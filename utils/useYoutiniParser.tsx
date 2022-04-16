import { EntryData, YoutiniData } from '../types';
import _ from 'lodash';
import moment from 'moment';

export async function useYoutiniParser(
  allBooks: YoutiniData[]
): Promise<EntryData[]> {
  let books: EntryData[] = [];

  for await (const book of allBooks) {
    let currentBook: EntryData = {
      canonicity: book.canonicity,
      coverImage: book['Cover Image URL'],
      title: book['Name (Title)']!.replace(/-/, '—'),
    };

    currentBook.author = book['Author / Writer'];
    currentBook.releaseDate = moment(book['Release Date']);
    currentBook.category = book['Category'];
    currentBook.links = {};

    const timelineIncludesTwoDates =
      book['Timeline']!.includes('-') ||
      book['Timeline']!.includes('–') ||
      book['Timeline']!.includes('/') ||
      book['Timeline']!.includes('—');

    if (timelineIncludesTwoDates) {
      const fullDate = book['Timeline']!.replace(/\s|,/g, '').replace(
        /\/|—|–/,
        '-'
      );

      let eras = fullDate.match(/([A-Z]{3})/g);
      if (eras!.length === 1) eras![1] = eras![0];
      let dates = fullDate.match(/[^\d]*(\d+)[^\d]*\-[^\d]*(\d+)[^\d]*/);
      dates!.shift();

      if (eras![1] === 'BBY') currentBook.timeline = Number(`-${dates![1]}`);
      if (eras![1] === 'ABY') currentBook.timeline = Number(`${dates![1]}`);
    }

    if (book['Timeline']?.endsWith('BBY') && !timelineIncludesTwoDates) {
      currentBook.timeline = Number(
        `-${book['Timeline'].replace(/[^0-9]/g, '')}`
      );
    }

    if (book['Timeline']?.endsWith('ABY') && !timelineIncludesTwoDates) {
      currentBook.timeline = Number(book['Timeline'].replace(/[^0-9]/g, ''));
    }

    if (
      currentBook.category === 'Adult Novel' ||
      currentBook.category === 'YA Novel' ||
      currentBook.category === 'Junior Reader' ||
      currentBook.category === 'Single Issue Comic' ||
      currentBook.category === 'Graphic Novel' ||
      currentBook.category === 'Omnibus'
    ) {
      books.push(currentBook);
    }
  }
  const resultsUniqeByTitle = _.uniqBy(books, 'title');
  return _.orderBy(resultsUniqeByTitle, 'title', 'asc');
}
