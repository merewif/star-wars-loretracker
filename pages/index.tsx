import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Header from "../comps/Header";
import ProgressBar from "../comps/ProgressBar";
import _ from "lodash";
import FiltersContainer from "../comps/Filters/FiltersContainer";
import CardContents from "../comps/card/CardContents";
import moment from "moment";
import { Waypoint } from "react-waypoint";
import {
  EntryData,
  MarkedEntries,
  PossibleModules,
  YoutiniData,
} from "../types";
import { supabase } from "../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import { FilterContext } from "../utils/useFilterContext";
import { useYoutiniParser } from "../utils/useYoutiniParser";
import { useYoutiniFetch } from "../utils/useYoutiniFetch";
import HeadContent from "../utils/HeadContent";
import Card from "../comps/card/Card";
import LoadingBackdrop from "../comps/MUI/LoadingBackdrop";
import TimelineWarning from "../comps/TimelineWarning";

export default function Home() {
  const [defaultFetchedData, setDefaultFetchedData] = useState<EntryData[]>([]);
  const [fetchedData, setFetchedData] = useState<EntryData[]>([]);
  const [paginationEndElement, setPaginationEndElement] = useState<number>(30);
  const [fetchedTitles, setFetchedTitles] = useState<string[]>([]);
  const [fetchedBooks, setFetchedBooks] = useState<EntryData[]>([]);
  const [fetchedComics, setFetchedComics] = useState<EntryData[]>([]);
  const [currentlyOpenedModule, setCurrentlyOpenedModule] =
    useState<PossibleModules>("movies");
  const [moduleKeys, setModuleKeys] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<any[]>(["title", "asc"]);
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
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredCreatorsName, setFilteredCreatorsName] = useState<string[]>(
    []
  );
  const [filteredEras, setFilteredEras] = useState<string[]>([]);
  const [canonicityFilterValue, setCanonicityFilterValue] = useState<
    "all" | "legends" | "canon"
  >("all");
  const [finishedFilterValue, setFinishedFilterValue] = useState("all");
  const [hideExcludedEntries, setHideExcludedEntries] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const [user, setUser] = useState<User | null>();
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [showTimelineWarning, setShowTimelineWarning] = useState<boolean>(false);

  async function fetchUserDataFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("userdata")
        .select("data")
        .eq("email", user?.email);

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
        .from("userdata")
        .upsert([{ email: user?.email, data: entriesMarkedAsFinished }]);

      if (error) {
        console.log(error);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    console.log("Hello there.");

    setCurrentlyOpenedModule("movies");
    fetchData("movies");

    if ("loretracker" in localStorage) {
      let storedData = JSON.parse(localStorage.getItem("loretracker") ?? "");
      if (!storedData.excluded) storedData.excluded = entriesMarkedAsExcluded;
      if (storedData.excluded) setEntriesMarkedAsExcluded(storedData.excluded);
      setEntriesMarkedAsFinished(storedData);
    }

    setUser(supabase.auth.user());

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event == "SIGNED_IN") {
          setUser(session?.user ?? null);
        }
        if (event == "SIGNED_OUT") {
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
      document.getElementsByClassName("navbtn") as HTMLCollectionOf<HTMLElement>
    );
    for (const btn of btns) {
      btn.style.color = "white";
    }

    if (currentlyOpenedModule)
      document.getElementById(currentlyOpenedModule)!.style.color = "#ffe81f";

    setSearchValue("");
    resetFilters();
  }, [currentlyOpenedModule]);

  useEffect(() => {
    setCardsHeight();
  }, [fetchedData, currentlyOpenedModule]);

  useEffect(() => {
    localStorage.setItem(
      "loretracker",
      JSON.stringify(entriesMarkedAsFinished)
    );

    if (user) upsertUserDataIntoDatabase();
  }, [entriesMarkedAsFinished]);

  useEffect(() => {
    calculateProgress();
  }, [defaultFetchedData, fetchedData, entriesMarkedAsFinished]);

  useEffect(() => {
    const sortedBooks = sortBooks(fetchedData);
    setFetchedData(sortedBooks);
  }, [currentlyOpenedModule, sortBy]);

  useEffect(() => {
    setSortBy(["title", "asc"]);
  }, [currentlyOpenedModule]);

  useEffect(() => {
    if (sortBy[0] === "timeline") {
      setShowTimelineWarning(true);
    }
    if (sortBy[0] !== "timeline") {
      setShowTimelineWarning(false);
    }
    
  }, [sortBy])

  useEffect(() => {
    filterEntries();
    if (searchValue) {
      searchEntries(searchValue);
    }
  }, [entriesMarkedAsFinished, entriesMarkedAsExcluded]);

  function sortBooks(data: EntryData[]) {
    if (sortBy[0] === "timeline") {
      return _.orderBy(data, ["timeline", "releaseDate"], sortBy[1]);
    }
    return _.orderBy(data, sortBy[0], sortBy[1]);
  }

  function calculateProgress() {
    if (finishedFilterValue === "finished") return setProgressBarValue(100);
    let finished = 0;
    let total = fetchedData.length;

    const dataIsUnfiltered = fetchedData.length === defaultFetchedData.length;
    if (dataIsUnfiltered && hideExcludedEntries) {
      total =
        fetchedData.length -
        entriesMarkedAsExcluded[currentlyOpenedModule].length;
    }

    if (entriesMarkedAsFinished[currentlyOpenedModule]) {
      for (const entry of entriesMarkedAsFinished[currentlyOpenedModule]) {
        for (const data of fetchedData) {
          if (_.includes(data, entry.replace(/-+/g, " "))) finished++;
        }
      }
    }

    const result = (finished / total) * 100;
    if (isNaN(result)) return setProgressBarValue(0);
    if (result > 100) return setProgressBarValue(100);
    setProgressBarValue(result);
  }

  function handleFileRead(event: any) {
    let collection = JSON.parse(event.target.result);
    if (!collection.excluded) collection.excluded = entriesMarkedAsExcluded;
    window.localStorage.setItem("loretracker", JSON.stringify(collection));
    setEntriesMarkedAsFinished(collection);
    setEntriesMarkedAsExcluded(collection.excluded);
  }

  async function setCardsHeight() {
    let cards = Array.from(
      document.getElementsByClassName(
        "entryCard"
      ) as HTMLCollectionOf<HTMLElement>
    );
    for await (const card of cards) {
      card.style.height = "auto";
    }

    let largestHeight = 0;
    for await (const card of cards) {
      if (card.offsetHeight > largestHeight) largestHeight = card.offsetHeight;
    }

    for (const card of cards) {
      card.style.height = `${largestHeight + 20}px`;
    }
  }

  function setDataIntoStates(data: EntryData[]) {
    const sortedBooks = sortBooks(data);
    setFetchedData(sortedBooks);
    setDefaultFetchedData(data);
    setModuleKeys(Object.keys(data[0]));
    fetchAllTitles(data);
    fetchAllCreators(data);
    fetchAllCategories(data);
    setShowBackdrop(false);
  }

  function displayData(target: PossibleModules) {
    setCurrentlyOpenedModule(target);

    if (target === "books" || target === "comics") {
      if (target === "books" && fetchedBooks.length)
        return setDataIntoStates(fetchedBooks);

      if (target === "comics" && fetchedComics.length)
        return setDataIntoStates(fetchedComics);

      setShowBackdrop(true);
      return useYoutiniFetch(target)
        .then((unformattedBooks: YoutiniData[]) =>
          useYoutiniParser(unformattedBooks)
        )
        .then((parsedBooks: EntryData[]) => {
          setDataIntoStates(parsedBooks);
          if (target === "books") setFetchedBooks(parsedBooks);
          if (target === "comics") setFetchedComics(parsedBooks);
        });
    }

    fetchData(target);
  }

  function searchEntries(input: string | undefined | null) {
    if (!input) {
      displayData(currentlyOpenedModule);
      setSearchValue("");
    }

    filterEntries(input, "search");
  }

  function fetchData(target: string) {
    setCanonicityFilterValue("all");
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    fetch("./data/" + target + ".json")
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
    setCreators(creators.sort());
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
    const currentTitle = entry.title.replace(/\s+/g, "-");
    let container = document.getElementById(`${currentTitle}-card`);

    const isEntryFinished =
      entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle);

    if (isEntryFinished) {
      container?.classList.remove("cardFinished");
      container?.classList.add("cardUnfinished");

      const arrWithoutEntry = _.without(
        entriesMarkedAsFinished[currentlyOpenedModule],
        currentTitle
      );

      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        [currentlyOpenedModule]: arrWithoutEntry,
      });

      localStorage.setItem(
        "loretracker",
        JSON.stringify({
          ...entriesMarkedAsFinished,
          [currentlyOpenedModule]: arrWithoutEntry,
        })
      );
    }

    if (!isEntryFinished) {
      container?.classList.remove("cardUnfinished");
      container?.classList.add("cardFinished");

      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        [currentlyOpenedModule]: [
          ...entriesMarkedAsFinished[currentlyOpenedModule],
          currentTitle,
        ],
      });

      localStorage.setItem(
        "loretracker",
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

  function filterEntries(value?: any, source?: string) {
    let canonicityParameter = canonicityFilterValue,
      creatorsParameters = filteredCreatorsName,
      finishedParameter = finishedFilterValue,
      erasParameters = filteredEras,
      categoryParameters = filteredCategories,
      hideExcluded = hideExcludedEntries,
      searchInput = searchValue;

    if (source === "canonicity") {
      setCanonicityFilterValue(value);
      canonicityParameter = value;
    }
    if (source === "creators") {
      let persons = typeof value === "string" ? value.split(",") : value;
      setFilteredCreatorsName(persons);
      creatorsParameters = persons;
    }
    if (source === "eras") {
      let erasToFilter = typeof value === "string" ? value.split(",") : value;
      setFilteredEras(erasToFilter);
      erasParameters = erasToFilter;
    }

    if (source === "categories") {
      let categoriesToFilter =
        typeof value === "string" ? value.split(",") : value;
      setFilteredCategories(categoriesToFilter);
      categoryParameters = categoriesToFilter;
    }

    if (source === "finished") {
      setFinishedFilterValue(value);
      finishedParameter = value;
    }

    if (source === "hideExcluded") {
      if (hideExcluded !== value) setHideExcludedEntries(value);
      hideExcluded = value;
    }

    if (source === "search") {
      if (searchValue !== value) setSearchValue(value);
      searchInput = value;
    }

    let filteredByCanon = filterByCanonicity(canonicityParameter);
    let filteredByFinished = filterByFinished(finishedParameter);
    let filteredByCreators = filterByCreators(creatorsParameters);
    let filteredByEras = filterByEras(erasParameters);
    let filteredByCategories = filterByCategories(categoryParameters);
    let filteredByExcludedEntries = filterExcludedEntries(hideExcluded);
    let filteredBySearchResults = filterBySearchResults(searchInput);

    const filteredEntries = _.intersection(
      filteredByCanon,
      filteredByFinished,
      filteredByCreators,
      filteredByEras,
      filteredByCategories,
      filteredByExcludedEntries,
      filteredBySearchResults
    );

    const filteredData: EntryData[] = _.flatten(filteredEntries);
    const sortedData = sortBooks(filteredData);
    setFetchedData(sortedData);
  }

  function filterByCanonicity(canonicityParameter: string): EntryData[] {
    let results: EntryData[] = [];

    if (!canonicityParameter || canonicityParameter === "all") {
      results = defaultFetchedData;
    }

    if (canonicityParameter === "legends") {
      results = _.filter(defaultFetchedData, { canonicity: false });
    }

    if (canonicityParameter === "canon") {
      results = _.filter(defaultFetchedData, { canonicity: true });
    }

    return results;
  }

  function filterByFinished(finishedParameter: string): EntryData[] {
    let listOfFinishedEntries = entriesMarkedAsFinished[currentlyOpenedModule];
    let listFilteredByFinished: any[] = [];

    if (finishedParameter === "all") {
      listFilteredByFinished = defaultFetchedData;
    }

    if (finishedParameter === "finished") {
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, " ");
        let result = _.filter(defaultFetchedData, { title: title });
        listFilteredByFinished.push(result);
      }
      listFilteredByFinished = _.flatten(listFilteredByFinished);
    }

    if (finishedParameter === "unfinished") {
      listFilteredByFinished = defaultFetchedData;
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, " ");
        listFilteredByFinished = _.reject(listFilteredByFinished, { title: title });
      }
    }

    return listFilteredByFinished;
  }

  function filterByCreators(creatorsParameters: Array<string>): EntryData[] {
    let listFilteredByCreators: any[] = [];
    if (!creatorsParameters.length) {
      listFilteredByCreators = defaultFetchedData;
    }

    if (creatorsParameters.length) {
      for (const person of creatorsParameters) {
        let entriesByPerson = _.filter(defaultFetchedData, function (o) {
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
      listFilteredByCreators = _.flatten(listFilteredByCreators);
    }

    return listFilteredByCreators;
  }

  function filterByEras(erasParameters: Array<string>): EntryData[] {
    let listFilteredByEras: any[] = [];

    if (!erasParameters.length) {
      listFilteredByEras = defaultFetchedData;
    }

    if (erasParameters.length) {
      for (const era of erasParameters) {
        let entriesByEra = _.filter(defaultFetchedData, {
          era: era,
        });

        listFilteredByEras.push(entriesByEra);
      }
      listFilteredByEras = _.flatten(listFilteredByEras);
    }

    return listFilteredByEras;
  }

  function filterByCategories(categoryParameters: Array<string>): EntryData[] {
    let listFilteredByCategories: any[] = [];

    if (!categoryParameters.length) {
      listFilteredByCategories = defaultFetchedData;
    }

    if (categoryParameters.length) {
      for (const category of categoryParameters) {
        let entriesByCategory = _.filter(defaultFetchedData, {
          category: category,
        });

        listFilteredByCategories.push(entriesByCategory);
      }
      listFilteredByCategories = _.flatten(listFilteredByCategories);
    }

    return listFilteredByCategories;
  }

  function filterExcludedEntries(hideExcluded: boolean): EntryData[] {
    let results: any[] = defaultFetchedData;

    if (hideExcluded && entriesMarkedAsExcluded[currentlyOpenedModule]) {
      const excludedEntries = entriesMarkedAsExcluded[currentlyOpenedModule];
      for (const entry of excludedEntries) {
        const title = entry.replace(/-/g, " ");
        results = _.reject(results, { title: title });
      }
    }
    return results;
  }

  function filterBySearchResults(searchInput: string): EntryData[] {
    let searchResults: any[] = [];

    if (!searchInput.length) {
      searchResults = defaultFetchedData;
    }

    if (searchInput.length) {
      for (const entry of defaultFetchedData) {
        if (entry.title.toLowerCase().includes(searchInput.toLowerCase())) {
          searchResults.push(entry);
        }
      }
    }
    return searchResults;
  }

  function resetFilters() {
    setFetchedData(defaultFetchedData);
    setCanonicityFilterValue("all");
    setFinishedFilterValue("all");
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    setFilteredCategories([]);
    setSearchValue('');
    fetchAllCreators(defaultFetchedData);
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

  const cardprops = {
    moduleKeys,
    excludeEntry,
    entriesMarkedAsFinished,
    toggleEntryAsFinished,
    currentlyOpenedModule,
  };

  return (
    <div className={styles.appcontainer}>
      <LoadingBackdrop open={showBackdrop} />
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
              {showTimelineWarning? <TimelineWarning /> : null}
              <ProgressBar progressBarValue={progressBarValue} />
            </>
          ) : null}          
          <div id={styles.moduleContainer}>
            {_.slice(fetchedData, 0, paginationEndElement).map((e1, i1) => {
              let currentTitle = e1.title.replace(/\s+/g, "-");
              if (
                hideExcludedEntries &&
                entriesMarkedAsExcluded[currentlyOpenedModule].includes(
                  currentTitle
                )
              )
                return;
              return (
                <Card
                  {...cardprops}
                  e1={e1}
                  currentTitle={currentTitle}
                  key={"1" + i1}
                />
              );
            })}
            <Waypoint onEnter={infiniteScroll} />
          </div>
        </div>
      </div>
    </div>
  );
}
