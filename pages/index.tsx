import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Header from '../comps/Header';
import ProgressBar from '../comps/ProgressBar';
import _ from 'lodash';
import FiltersContainer from '../comps/Filters/FiltersContainer';
import CardContents from '../comps/card/CardContents';
import moment from 'moment';
import { Waypoint } from 'react-waypoint';
import {
  EntryData,
  MarkedEntries,
  PossibleModules,
  YoutiniData,
} from '../types';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { FilterContext } from '../utils/useFilterContext';
import { useYoutiniParser } from '../utils/useYoutiniParser';
import { useYoutiniFetch } from '../utils/useYoutiniFetch';
import HeadContent from '../utils/HeadContent';

export default function Home() {
  const [defaultFetchedData, setDefaultFetchedData] = useState<EntryData[]>([]);
  const [fetchedData, setFetchedData] = useState<EntryData[]>([]);
  const [paginationEndElement, setPaginationEndElement] = useState<number>(30);
  const [fetchedTitles, setFetchedTitles] = useState<string[]>([]);
  const [currentlyOpenedModule, setCurrentlyOpenedModule] =
    useState<PossibleModules>('movies');
  const [moduleKeys, setModuleKeys] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<any[]>(['title', 'asc']);
  const [entriesMarkedAsExcluded, setEntriesMarkedAsExcluded] =
    useState<MarkedEntries>({
      movies: [],
      games: [],
      books: [],
      comics: [],
      series: [],
    });
  const [entriesMarkedAsFinished, setEntriesMarkedAsFinished] =
    useState<MarkedEntries>({
      movies: [],
      games: [],
      books: [],
      comics: [],
      series: [],
      excluded: entriesMarkedAsExcluded,
    });
  const [filterboxAnchorEl, setFilterboxAnchorEl] = useState(null);
  const [creators, setCreators] = useState<string[]>([]);
  const [eras, setEras] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredCreatorsName, setFilteredCreatorsName] = useState<string[]>(
    []
  );
  const [filteredEras, setFilteredEras] = useState<string[]>([]);
  const [canonicityFilterValue, setCanonicityFilterValue] = useState('all');
  const [finishedFilterValue, setFinishedFilterValue] = useState('all');
  const [hideExcludedEntries, setHideExcludedEntries] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const [user, setUser] = useState<User | null>();

  async function fetchUserDataFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('userdata')
        .select('data')
        .eq('email', user?.email);

      if (data) {
        setEntriesMarkedAsFinished(data[0].data);
        setEntriesMarkedAsExcluded(data[0].data.excluded);
      }

      return;

      if (error) {
        console.log(error);
      }
    } catch (error: any) {
      console.log(error.message);
      if (user) {
        upsertUserDataIntoDatabase();
      }
    }

    return;
  }

  async function upsertUserDataIntoDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('userdata')
        .upsert([{ email: user?.email, data: entriesMarkedAsFinished }]);

      if (error) {
        console.log(error);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    console.log('Hello there.');

    setCurrentlyOpenedModule('movies');
    fetchData('movies');

    if ('loretracker' in localStorage) {
      let storedData = JSON.parse(localStorage.getItem('loretracker') ?? '');
      if (!storedData.excluded) storedData.excluded = entriesMarkedAsExcluded;
      if (storedData.excluded) setEntriesMarkedAsExcluded(storedData.excluded);
      setEntriesMarkedAsFinished(storedData);
    }

    setUser(supabase.auth.user());

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event == 'SIGNED_IN') {
          setUser(session?.user ?? null);
        }
        if (event == 'SIGNED_OUT') {
          setEntriesMarkedAsExcluded({
            movies: [],
            games: [],
            books: [],
            comics: [],
            series: [],
          });
          setEntriesMarkedAsFinished({
            movies: [],
            games: [],
            books: [],
            comics: [],
            series: [],
            excluded: entriesMarkedAsExcluded,
          });
        }
      }
    );
    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) fetchUserDataFromDatabase();
  }, [user]);

  useEffect(() => {
    let btns = Array.from(
      document.getElementsByClassName('navbtn') as HTMLCollectionOf<HTMLElement>
    );
    for (const btn of btns) {
      btn.style.color = 'white';
    }

    if (currentlyOpenedModule)
      document.getElementById(currentlyOpenedModule)!.style.color = '#ffe81f';

    resetFilters();
  }, [currentlyOpenedModule]);

  useEffect(() => {
    setCardsHeight();
  }, [fetchedData, currentlyOpenedModule]);

  useEffect(() => {
    localStorage.setItem(
      'loretracker',
      JSON.stringify(entriesMarkedAsFinished)
    );

    if (user) upsertUserDataIntoDatabase();
  }, [entriesMarkedAsFinished]);

  useEffect(() => {
    calculateProgress();
  }, [defaultFetchedData, fetchedData, entriesMarkedAsFinished]);

  useEffect(() => {
    setFetchedData(_.orderBy(fetchedData, sortBy[0], sortBy[1]));
  }, [sortBy]);

  function calculateProgress() {
    if (finishedFilterValue === 'finished') return setProgressBarValue(100);
    let finished = 0;
    let total = 0;

    if (fetchedData)
      total =
        fetchedData.length -
        entriesMarkedAsExcluded[currentlyOpenedModule].length;
    if (entriesMarkedAsFinished[currentlyOpenedModule]) {
      for (const entry of entriesMarkedAsFinished[currentlyOpenedModule]) {
        for (const data of fetchedData) {
          if (_.includes(data, entry.replace(/-+/g, ' '))) finished++;
        }
      }
    }

    const result = (finished / total) * 100;
    if (isNaN(result)) return setProgressBarValue(0);
    setProgressBarValue(result);
  }

  function handleFileRead(event: any) {
    let collection = JSON.parse(event.target.result);
    if (!collection.excluded) collection.excluded = entriesMarkedAsExcluded;
    window.localStorage.setItem('loretracker', JSON.stringify(collection));
    setEntriesMarkedAsFinished(collection);
    setEntriesMarkedAsExcluded(collection.excluded);
  }

  async function setCardsHeight() {
    let cards = Array.from(
      document.getElementsByClassName(
        'entryCard'
      ) as HTMLCollectionOf<HTMLElement>
    );
    for await (const card of cards) {
      card.style.height = 'auto';
    }

    let largestHeight = 0;
    for await (const card of cards) {
      if (card.offsetHeight > largestHeight) largestHeight = card.offsetHeight;
    }

    for (const card of cards) {
      card.style.height = `${largestHeight}px`;
    }
  }

  function setDataIntoStates(data: EntryData[]) {
    setFetchedData(_.orderBy(data, sortBy[0], sortBy[1]));
    setDefaultFetchedData(data);
    setModuleKeys(Object.keys(data[0]));
    fetchAllTitles(data);
    fetchAllCreators(data);
    fetchAllEras(data);
    fetchAllCategories(data);
  }

  function displayData(target: PossibleModules) {
    setCurrentlyOpenedModule(target);
    setHideExcludedEntries(true);

    if (target === 'books' || target === 'comics')
      return useYoutiniFetch(target)
        .then((books: YoutiniData[]) => useYoutiniParser(books))
        .then((books: EntryData[]) => setDataIntoStates(books));

    fetchData(target);
  }

  function searchEntries(input: string | undefined | null) {
    if (!input) {
      displayData(currentlyOpenedModule);
      setSearchValue('');
      return;
    }

    if (input.length) setSearchValue(input);

    let results = [];
    for (const entry of fetchedData) {
      if (entry.title.toLowerCase().includes(input.toLowerCase())) {
        results.push(entry);
      }
    }

    if (results.length) {
      setFetchedData(results);
    }
  }

  function fetchData(target: string) {
    setCanonicityFilterValue('all');
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    fetch('./data/' + target + '.json')
      .then((response) => response.json())
      .then((data) => {
        setDataIntoStates(data);
      });
  }

  function fetchAllTitles(data: EntryData[]) {
    let titles = [];
    for (const entry of data) {
      titles.push(entry.title);
    }

    setFetchedTitles(titles);
  }

  function fetchAllCreators(data: EntryData[]) {
    let creators: string[] = [];

    for (const entry of data) {
      if (entry.author && !creators.includes(entry.author))
        creators.push(entry.author);
      if (entry.createdBy && !creators.includes(entry.createdBy))
        creators.push(entry.createdBy);
      if (entry.directedBy && !creators.includes(entry.directedBy))
        creators.push(entry.directedBy);
    }
    setCreators(creators);
  }

  function fetchAllEras(data: EntryData[]) {
    let fetchedEras: string[] = [];
    for (const entry of data) {
      if (entry.era && !fetchedEras.includes(entry.era))
        fetchedEras.push(entry.era);
    }
    setEras(fetchedEras);
  }

  function fetchAllCategories(data: EntryData[]) {
    let fetchedCategories: string[] = [];
    for (const entry of data) {
      if (entry.category && !fetchedCategories.includes(entry.category))
        fetchedCategories.push(entry.category);
    }
    setCategories(fetchedCategories);
  }

  function excludeEntry(entry: string) {
    if (!_.includes(entriesMarkedAsExcluded[currentlyOpenedModule], entry)) {
      setEntriesMarkedAsExcluded({
        ...entriesMarkedAsExcluded,
        [currentlyOpenedModule]: [
          ...entriesMarkedAsExcluded[currentlyOpenedModule],
          entry,
        ],
      });

      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        excluded: {
          ...entriesMarkedAsFinished.excluded,
          [currentlyOpenedModule]: [
            ...entriesMarkedAsFinished.excluded[currentlyOpenedModule],
            entry,
          ],
        },
      });
    }
    setSearchValue('');
  }

  function removeFromExcluded(category: string, entry: EntryData) {
    setEntriesMarkedAsFinished({
      ...entriesMarkedAsFinished,
      excluded: {
        ...entriesMarkedAsFinished.excluded,
        [category]: _.without(
          entriesMarkedAsFinished.excluded[category],
          entry
        ),
      },
    });

    setEntriesMarkedAsExcluded({
      ...entriesMarkedAsExcluded,
      [category]: _.without(entriesMarkedAsExcluded[category], entry),
    });
  }

  function toggleEntryAsFinished(entry: EntryData) {
    const currentTitle = entry.title.replace(/\s+/g, '-');
    let container = document.getElementById(`${currentTitle}-card`);

    const isEntryFinished =
      entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle);

    if (isEntryFinished) {
      container?.classList.remove('cardFinished');
      container?.classList.add('cardUnfinished');

      const arrWithoutEntry = _.without(
        entriesMarkedAsFinished[currentlyOpenedModule],
        currentTitle
      );

      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        [currentlyOpenedModule]: arrWithoutEntry,
      });

      localStorage.setItem(
        'loretracker',
        JSON.stringify({
          ...entriesMarkedAsFinished,
          [currentlyOpenedModule]: arrWithoutEntry,
        })
      );
    }

    if (!isEntryFinished) {
      container?.classList.remove('cardUnfinished');
      container?.classList.add('cardFinished');

      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        [currentlyOpenedModule]: [
          ...entriesMarkedAsFinished[currentlyOpenedModule],
          currentTitle,
        ],
      });

      localStorage.setItem(
        'loretracker',
        JSON.stringify({
          ...entriesMarkedAsFinished,
          [currentlyOpenedModule]: [
            ...entriesMarkedAsFinished[currentlyOpenedModule],
            currentTitle,
          ],
        })
      );
    }
  }

  function filterEntries(value: any, source: string) {
    let canonicityParameter = canonicityFilterValue,
      creatorsParameters = filteredCreatorsName,
      finishedParameter = finishedFilterValue,
      erasParameters = filteredEras,
      categoryParameters = filteredCategories,
      hideExcluded = hideExcludedEntries;

    if (source === 'canonicity') {
      setCanonicityFilterValue(value);
      canonicityParameter = value;
    }
    if (source === 'creators') {
      let persons = typeof value === 'string' ? value.split(',') : value;
      setFilteredCreatorsName(persons);
      creatorsParameters = persons;
    }
    if (source === 'eras') {
      let erasToFilter = typeof value === 'string' ? value.split(',') : value;
      setFilteredEras(erasToFilter);
      erasParameters = erasToFilter;
    }

    if (source === 'categories') {
      let categoriesToFilter =
        typeof value === 'string' ? value.split(',') : value;
      setFilteredCategories(categoriesToFilter);
      categoryParameters = categoriesToFilter;
    }

    if (source === 'finished') {
      setFinishedFilterValue(value);
      finishedParameter = value;
    }

    if (source === 'hideExcluded') {
      if (hideExcluded !== value) setHideExcludedEntries(value);
      hideExcluded = value;
    }

    let filteredResults: any = defaultFetchedData;

    // Filter by Canon
    if (canonicityParameter === 'legends') {
      filteredResults = _.filter(defaultFetchedData, { canonicity: false });
    }

    if (canonicityParameter === 'canon') {
      filteredResults = _.filter(defaultFetchedData, { canonicity: true });
    }

    // Filter by Finished
    let listOfFinishedEntries = entriesMarkedAsFinished[currentlyOpenedModule];
    let listFilteredByFinished = [];

    if (finishedParameter === 'finished') {
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, ' ');
        let result = _.filter(filteredResults, { title: title });
        listFilteredByFinished.push(result);
      }
      filteredResults = _.flatten(listFilteredByFinished);
    }

    if (finishedParameter === 'unfinished') {
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, ' ');
        filteredResults = _.reject(filteredResults, { title: title });
      }
    }

    // Filter by Creator
    if (creatorsParameters.length) {
      let listFilteredByCreators = [];
      for (const person of creatorsParameters) {
        let entriesByPerson = _.filter(filteredResults, function (o) {
          if (
            o.author === person ||
            o.directedBy === person ||
            o.createdBy === person
          )
            return o;
          return;
        });

        listFilteredByCreators.push(entriesByPerson);
      }
      filteredResults = _.flatten(listFilteredByCreators);
    }

    // Filter by Era
    if (erasParameters.length) {
      let listFilteredByEras = [];
      for (const era of erasParameters) {
        let entriesByEra = _.filter(filteredResults, {
          era: era,
        });

        listFilteredByEras.push(entriesByEra);
      }
      filteredResults = _.flatten(listFilteredByEras);
    }

    // Filter by Category
    if (categoryParameters.length) {
      let listFilteredByCategories = [];
      for (const category of categoryParameters) {
        let entriesByCategory = _.filter(filteredResults, {
          category: category,
        });

        listFilteredByCategories.push(entriesByCategory);
      }
      filteredResults = _.flatten(listFilteredByCategories);
    }

    // Filter excluded entries
    if (hideExcluded && entriesMarkedAsExcluded[currentlyOpenedModule]) {
      const excludedEntries = entriesMarkedAsExcluded[currentlyOpenedModule];
      for (const entry of excludedEntries) {
        const title = entry.replace(/-/g, ' ');
        filteredResults = _.reject(filteredResults, { title: title });
      }
    }

    const filteredData = _.flatten(filteredResults);
    setFetchedData(_.orderBy(filteredResults, sortBy[0], sortBy[1]));
  }

  function resetFilters() {
    setFetchedData(defaultFetchedData);
    setCanonicityFilterValue('all');
    setFinishedFilterValue('all');
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    setFilteredCategories([]);
    fetchAllCreators(defaultFetchedData);
    fetchAllEras(defaultFetchedData);
  }

  function infiniteScroll() {
    if (fetchedData.length < paginationEndElement) return;
    setPaginationEndElement((currentState) => currentState + 30);
    setCardsHeight();
  }

  const filterprops = {
    sortBy,
    creators,
    setSortBy,
    categories,
    moduleKeys,
    searchValue,
    resetFilters,
    filterEntries,
    searchEntries,
    fetchedTitles,
    filterboxAnchorEl,
    removeFromExcluded,
    filteredCategories,
    hideExcludedEntries,
    finishedFilterValue,
    setFilterboxAnchorEl,
    filteredCreatorsName,
    canonicityFilterValue,
    entriesMarkedAsExcluded,
  };

  return (
    <div className={styles.appcontainer}>
      <HeadContent module={currentlyOpenedModule} />
      <Header displayData={displayData} handleFileRead={handleFileRead} />
      <div className={styles.viewerContainer}>
        <div id={styles.viewer}>
          {currentlyOpenedModule ? (
            <>
              <div id={styles.sortContainer}>
                <FilterContext.Provider value={filterprops}>
                  <FiltersContainer />
                </FilterContext.Provider>
              </div>
              <ProgressBar progressBarValue={progressBarValue} />
            </>
          ) : null}
          <div id={styles.moduleContainer}>
            {_.slice(fetchedData, 0, paginationEndElement).map((e1, i1) => {
              let currentTitle = e1.title.replace(/\s+/g, '-');
              if (
                hideExcludedEntries &&
                entriesMarkedAsExcluded[currentlyOpenedModule].includes(
                  currentTitle
                )
              )
                return;
              return (
                <div
                  className={
                    entriesMarkedAsFinished[currentlyOpenedModule].includes(
                      currentTitle
                    )
                      ? `${styles.cardFinished} entryCard cardFinished`
                      : `${styles.cardUnfinished} entryCard cardUnfinished`
                  }
                  id={currentTitle + '-card'}
                  key={'1' + i1}
                >
                  {moduleKeys.map((e2, i2) => {
                    let currentKey = moduleKeys[i2];
                    let currentValue = e1[currentKey as keyof EntryData];
                    return (
                      <CardContents
                        i2={i2}
                        currentKey={currentKey}
                        currentValue={currentValue}
                        key={i2}
                        excludeEntry={excludeEntry}
                        currentTitle={currentTitle}
                      />
                    );
                  })}
                  <button
                    onClick={(e) => toggleEntryAsFinished(e1)}
                    className={styles.finishedBtn}
                    id={e1.title.replace(/\s+/g, '-').toLowerCase() + 'btn'}
                  >
                    {entriesMarkedAsFinished[
                      currentlyOpenedModule as keyof MarkedEntries
                    ]?.includes(currentTitle)
                      ? 'Mark as Unfinished'
                      : 'Mark as Finished'}
                  </button>
                </div>
              );
            })}
            <Waypoint onEnter={infiniteScroll} />
          </div>
        </div>
      </div>
    </div>
  );
}
