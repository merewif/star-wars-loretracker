import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Header from "../comps/Header";
import Footer from "../comps/Footer";
import _ from "lodash";
import LinksContainer from "../comps/card/LinksContainer";
import FiltersContainer from "../comps/Filters/FiltersContainer";
import CardContents from "../comps/card/CardContents";

export default function Home() {
  const [defaultFetchedData, setDefaultFetchedData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
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
  const [filteredCreatorsName, setFilteredCreatorsName] = useState([]);
  const [filteredEras, setFilteredEras] = useState([]);
  const [canonicityFilterValue, setCanonicityFilterValue] = useState("all");
  const [finishedFilterValue, setFinishedFilterValue] = useState("all");
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    let btns = document.getElementsByClassName("navbtn");
    for (const btn of btns) {
      btn.style.color = "white";
    }

    if (currentlyOpenedModule)
      document.getElementById(currentlyOpenedModule).style.color = "#ffe81f";
  }, [currentlyOpenedModule]);

  useEffect(() => {
    fetch("./data/books/Youtini Bookshelf - Legends Books.json")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  function displayData(e) {
    setCurrentlyOpenedModule(e.target.id);
    fetchData(e.target.id);
  }

  function searchEntries(input) {
    setSearchValue(input);
    if (!input) {
      fetchData(currentlyOpenedModule);
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

  function orderBy(event, order = "asc") {
    setFetchedData(_.orderBy(fetchedData, event.target.value, order));
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
    }
  }

  function filterEntries(value, source) {
    let canonicityParameter = canonicityFilterValue,
      creatorsParameters = filteredCreatorsName,
      finishedParameter = finishedFilterValue,
      erasParameters = filteredEras;

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

    setFetchedData(_.flatten(filteredResults));
  }

  function resetFilters() {
    setFetchedData(defaultFetchedData);
    setCanonicityFilterValue("all");
    setFinishedFilterValue("all");
    setFilteredCreatorsName([]);
    setFilteredEras([]);
    fetchAllCreators(defaultFetchedData);
    fetchAllEras(defaultFetchedData);
  }

  return (
    <div className={styles.appcontainer}>
      <Head>
        <title>Star Wars Loretracker</title>
        <meta
          name="description"
          content="Track which Star Wars content you consooomed."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header displayData={displayData} />

      <div className={styles.viewerContainer}>
        <div id={styles.viewer}>
          {currentlyOpenedModule ? (
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
                fetchedTitles={fetchedTitles}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                searchEntries={searchEntries}
                sortBy={sortBy}
                orderBy={orderBy}
                moduleKeys={moduleKeys}
              />
            </div>
          ) : null}
          <div id={styles.moduleContainer}>
            {fetchedData.map((e1, i1) => {
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
