import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Header from "../comps/Header";
import ProgressBar from "../comps/ProgressBar";
import _ from "lodash";
import FiltersContainer from "../comps/Filters/FiltersContainer";
import CardContents from "../comps/card/CardContents";
import moment from "moment";
import { Waypoint } from "react-waypoint";

export default function Home() {
  const [defaultFetchedData, setDefaultFetchedData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [paginationEndElement, setPaginationEndElement] = useState(30);
  const [fetchedTitles, setFetchedTitles] = useState([]);
  const [currentlyOpenedModule, setCurrentlyOpenedModule] = useState();
  const [moduleKeys, setModuleKeys] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [entriesMarkedAsFinished, setEntriesMarkedAsFinished] = useState({
    movies: [],
    games: [],
    books: [],
    comics: [],
    series: [],
  });
  const [filterboxAnchorEl, setFilterboxAnchorEl] = useState(null);
  const [creators, setCreators] = useState([]);
  const [eras, setEras] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredCreatorsName, setFilteredCreatorsName] = useState([]);
  const [filteredEras, setFilteredEras] = useState([]);
  const [canonicityFilterValue, setCanonicityFilterValue] = useState("all");
  const [finishedFilterValue, setFinishedFilterValue] = useState("all");
  const [searchValue, setSearchValue] = useState();
  const [progressBarValue, setProgressBarValue] = useState(0);

  useEffect(() => {
    setCurrentlyOpenedModule("movies");
    fetchData("movies");

    if ("loretracker" in localStorage)
      setEntriesMarkedAsFinished(
        JSON.parse(localStorage.getItem("loretracker"))
      );
  }, []);

  useEffect(() => {
    let btns = document.getElementsByClassName("navbtn");
    for (const btn of btns) {
      btn.style.color = "white";
    }

    if (currentlyOpenedModule)
      document.getElementById(currentlyOpenedModule).style.color = "#ffe81f";
  }, [currentlyOpenedModule]);

  useEffect(() => {
    setCardsHeight();
  }, [fetchedData, currentlyOpenedModule]);

  useEffect(() => {
    calculateProgress();
  }, [defaultFetchedData, , fetchedData, entriesMarkedAsFinished]);

  function calculateProgress() {
    let finished = 0;
    let total = 0;

    if (fetchedData) total = fetchedData.length;
    if (entriesMarkedAsFinished[currentlyOpenedModule]) {
      for (const entry of entriesMarkedAsFinished[currentlyOpenedModule]) {
        for (const data of fetchedData) {
          if (_.includes(data, entry.replace(/-+/g, " "))) finished++;
        }
      }
    }
    const result = (finished / total) * 100;
    if (isNaN(result)) return setProgressBarValue(0);
    setProgressBarValue(result);
  }

  function handleFileRead(event) {
    let collection = JSON.parse(event.target.result);
    window.localStorage.setItem("loretracker", JSON.stringify(collection));
    setEntriesMarkedAsFinished(collection);
  }

  async function setCardsHeight() {
    let cards = document.getElementsByClassName("entryCard");

    for await (const card of cards) {
      card.style.height = "auto";
    }

    let largestHeight = 0;
    for await (const card of cards) {
      if (card.offsetHeight > largestHeight) largestHeight = card.offsetHeight;
    }

    for (const card of cards) {
      card.style.height = `${largestHeight}px`;
    }
  }

  async function fetchYoutiniBooks() {
    let allBooks = [];

    await fetch("./data/books/Youtini Bookshelf - Legends Books.json")
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          allBooks.push(entry);
        }
      });

    await fetch("./data/books/Youtini Bookshelf - Canon Books.json")
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = true;
          allBooks.push(entry);
        }
      });

    parseYoutiniData(allBooks);
  }

  async function fetchYoutiniComics() {
    let allComics = [];

    await fetch("./data/comics/Youtini Bookshelf - Canon Comics.json")
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = true;
          allComics.push(entry);
        }
      });

    await fetch("./data/comics/Youtini Bookshelf - Legends Comics (ABY).json")
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          allComics.push(entry);
        }
      });

    await fetch("./data/comics/Youtini Bookshelf - Legends Comics (BBY).json")
      .then((response) => response.json())
      .then((data) => {
        for (const entry of data) {
          entry.canonicity = false;
          allComics.push(entry);
        }
      });
    parseYoutiniData(allComics);
  }

  async function parseYoutiniData(allBooks) {
    let books = [];

    for await (const book of allBooks) {
      let currentBook = {};

      currentBook.canonicity = book.canonicity;
      currentBook.coverImage = book["Cover Image URL"];
      currentBook.title = book["Name (Title)"];
      currentBook.author = book["Author / Writer"];
      currentBook.releaseDate = moment(book["Release Date"]);
      currentBook.category = book["Category"];
      currentBook.links = {};

      const timelineIncludesTwoDates =
        book["Timeline"].includes("-") ||
        book["Timeline"].includes("/") ||
        book["Timeline"].includes("—");

      if (timelineIncludesTwoDates) {
        const fullDate = book["Timeline"]
          .replace(/\s|,/g, "")
          .replace(/\/|—/, "-");

        let eras = fullDate.match(/([A-Z]{3})/g);
        if (eras.length === 1) eras[1] = eras[0];
        let dates = fullDate.match(/[^\d]*(\d+)[^\d]*\-[^\d]*(\d+)[^\d]*/);
        dates.shift();

        if (eras[1] === "BBY") currentBook.timeline = Number(`-${dates[1]}`);
        if (eras[1] === "ABY") currentBook.timeline = Number(`${dates[1]}`);

        if (book["Timeline"].includes("—"))
          console.log(book["Timeline"], fullDate, currentBook.timeline);
      }

      if (book["Timeline"].endsWith("BBY") && !timelineIncludesTwoDates) {
        currentBook.timeline = Number(
          `-${book["Timeline"].replace(/[^0-9]/g, "")}`
        );
      }

      if (book["Timeline"].endsWith("ABY") && !timelineIncludesTwoDates) {
        currentBook.timeline = Number(book["Timeline"].replace(/[^0-9]/g, ""));
      }

      if (
        currentBook.category === "Adult Novel" ||
        currentBook.category === "YA Novel" ||
        currentBook.category === "Junior Reader" ||
        currentBook.category === "Single Issue Comic" ||
        currentBook.category === "Graphic Novel" ||
        currentBook.category === "Omnibus"
      ) {
        books.push(currentBook);
      }
    }
    setFetchedData(books);
    setDefaultFetchedData(books);
    setModuleKeys(Object.keys(books[0]));
    fetchAllTitles(books);
    fetchAllCreators(books);
    fetchAllEras(books);
    fetchAllCategories(books);
  }

  function displayData(target) {
    setCurrentlyOpenedModule(target);
    if (target === "books") return fetchYoutiniBooks();
    if (target === "comics") return fetchYoutiniComics();
    fetchData(target);
  }

  function searchEntries(input) {
    setSearchValue(input);
    if (!input) {
      displayData(currentlyOpenedModule);
      return;
    }

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

  function fetchData(target) {
    setCanonicityFilterValue("all");
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    fetch("./data/" + target + ".json")
      .then((response) => response.json())
      .then((data) => {
        setFetchedData(data);
        setDefaultFetchedData(data);
        setModuleKeys(Object.keys(data[0]));
        fetchAllTitles(data);
        fetchAllCreators(data);
        fetchAllEras(data);
        fetchAllCategories(data);
      });
  }

  function fetchAllTitles(data) {
    let titles = [];
    for (const entry of data) {
      titles.push(entry.title);
    }

    setFetchedTitles(titles);
  }

  function fetchAllCreators(data) {
    let creators = [];

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

  function fetchAllEras(data) {
    let fetchedEras = [];
    for (const entry of data) {
      if (entry.era && !fetchedEras.includes(entry.era))
        fetchedEras.push(entry.era);
    }
    setEras(fetchedEras);
  }

  function fetchAllCategories(data) {
    let fetchedCategories = [];
    for (const entry of data) {
      if (entry.category && !fetchedCategories.includes(entry.category))
        fetchedCategories.push(entry.category);
    }
    setCategories(fetchedCategories);
  }

  function orderBy(value, order = "asc") {
    setFetchedData(_.orderBy(fetchedData, value, order));
  }

  function toggleEntryAsFinished(event, entry) {
    const currentTitle = entry.title.replace(/\s+/g, "-");
    let container = document.getElementById(`${currentTitle}-card`);

    const isEntryFinished =
      entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle);

    if (isEntryFinished) {
      container.classList.remove("cardFinished");
      container.classList.add("cardUnfinished");

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
      container.classList.remove("cardUnfinished");
      container.classList.add("cardFinished");

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

  function filterEntries(value, source) {
    let canonicityParameter = canonicityFilterValue,
      creatorsParameters = filteredCreatorsName,
      finishedParameter = finishedFilterValue,
      erasParameters = filteredEras,
      categoryParameters = filteredCategories;

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

    let filteredResults = defaultFetchedData;

    // Filter by Canon
    if (canonicityParameter === "legends") {
      filteredResults = _.filter(defaultFetchedData, { canonicity: false });
    }

    if (canonicityParameter === "canon") {
      filteredResults = _.filter(defaultFetchedData, { canonicity: true });
    }

    // Filter by Finished
    let listOfFinishedEntries = entriesMarkedAsFinished[currentlyOpenedModule];
    let listFilteredByFinished = [];

    if (finishedParameter === "finished") {
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, " ");
        let result = _.filter(filteredResults, { title: title });
        listFilteredByFinished.push(result);
      }
      filteredResults = _.flatten(listFilteredByFinished);
    }

    if (finishedParameter === "unfinished") {
      for (const entry of listOfFinishedEntries) {
        const title = entry.replace(/-/g, " ");
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

    setFetchedData(_.flatten(filteredResults));
  }

  function resetFilters() {
    setFetchedData(defaultFetchedData);
    setCanonicityFilterValue("all");
    setFinishedFilterValue("all");
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

  return (
    <div className={styles.appcontainer}>
      <Head>
        <title>Star Wars Loretracker</title>
        <meta
          name="description"
          content="Track which Star Wars content you consooomed."
        />
        <meta property="og:title" content="Star Wars Loretracker" />
        <meta
          property="og:description"
          content="Track which Star Wars content you consooomed."
        />
        <meta
          property="og:url"
          content="https://star-wars-loretracker.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header displayData={displayData} handleFileRead={handleFileRead} />
      <div className={styles.viewerContainer}>
        <div id={styles.viewer}>
          {currentlyOpenedModule ? (
            <>
              <div id={styles.sortContainer}>
                <FiltersContainer
                  filterboxAnchorEl={filterboxAnchorEl}
                  setFilterboxAnchorEl={setFilterboxAnchorEl}
                  canonicityFilterValue={canonicityFilterValue}
                  filterEntries={filterEntries}
                  finishedFilterValue={finishedFilterValue}
                  filteredCreatorsName={filteredCreatorsName}
                  creators={creators}
                  filteredEras={filteredEras}
                  resetFilters={resetFilters}
                  eras={eras}
                  categories={categories}
                  fetchedTitles={fetchedTitles}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  searchEntries={searchEntries}
                  sortBy={sortBy}
                  orderBy={orderBy}
                  moduleKeys={moduleKeys}
                  filteredCategories={filteredCategories}
                />
              </div>
              <ProgressBar progressBarValue={progressBarValue} />
            </>
          ) : null}
          <div id={styles.moduleContainer}>
            {_.slice(fetchedData, 0, paginationEndElement).map((e1, i1) => {
              let currentTitle = e1.title.replace(/\s+/g, "-");
              return (
                <div
                  className={
                    entriesMarkedAsFinished[currentlyOpenedModule].includes(
                      currentTitle
                    )
                      ? `${styles.cardFinished} entryCard cardFinished`
                      : `${styles.cardUnfinished} entryCard cardUnfinished`
                  }
                  id={currentTitle + "-card"}
                  key={"1" + i1}
                >
                  {moduleKeys.map((e2, i2) => {
                    let currentKey = moduleKeys[i2];
                    let currentValue = e1[currentKey];
                    return (
                      <CardContents
                        i2={i2}
                        currentKey={currentKey}
                        currentValue={currentValue}
                      />
                    );
                  })}
                  <button
                    onClick={(e) => toggleEntryAsFinished(e, e1)}
                    className={styles.finishedBtn}
                    id={e1.title.replace(/\s+/g, "-").toLowerCase() + "btn"}
                  >
                    {entriesMarkedAsFinished[currentlyOpenedModule].includes(
                      currentTitle
                    )
                      ? "Mark as Unfinished"
                      : "Mark as Finished"}
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
