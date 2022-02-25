import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Header from "../comps/Header";
import Footer from "../comps/Footer";
import _ from "lodash";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Popover from "@mui/material/Popover";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Home() {
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
  const [filterParameters, setFilterParameters] = useState([]);

  useEffect(() => {
    let btns = document.getElementsByClassName("navbtn");
    for (const btn of btns) {
      btn.style.color = "white";
    }

    if (currentlyOpenedModule)
      document.getElementById(currentlyOpenedModule).style.color = "#ffe81f";
  }, [currentlyOpenedModule]);

  function displayData(e) {
    setCurrentlyOpenedModule(e.target.id);
    fetchData(e.target.id);
  }

  function searchEntries(input) {
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
    fetch("./data/" + target + ".json")
      .then((response) => response.json())
      .then((data) => {
        setFetchedData(data);
        setModuleKeys(Object.keys(data[0]));

        let titles = [];
        for (const entry of data) {
          let currentTitle = entry.title;
          titles.push(currentTitle);
        }
        setFetchedTitles(titles);
      });
  }

  function orderBy(event, order = "asc") {
    setFetchedData(_.orderBy(fetchedData, event.target.value, order));
  }

  function toggleEntryAsFinished(event, entry) {
    const currentTitle = entry.title.replace(/\s+/g, "-").toLowerCase();
    const isEntryFinished =
      entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle);

    if (isEntryFinished) {
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
      setEntriesMarkedAsFinished({
        ...entriesMarkedAsFinished,
        [currentlyOpenedModule]: [
          ...entriesMarkedAsFinished[currentlyOpenedModule],
          currentTitle,
        ],
      });
    }
  }

  function filterByParameters() {}

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
          {fetchedData.length ? (
            <div id={styles.sortContainer}>
              <div style={{ display: "flex", width: "25%" }}>
                <button onClick={(e) => setFilterboxAnchorEl(e.currentTarget)}>
                  <FilterListIcon />
                </button>
                <Popover
                  id={open ? "simple-popover" : undefined}
                  open={Boolean(filterboxAnchorEl)}
                  anchorEl={filterboxAnchorEl}
                  onClose={() => setFilterboxAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div id={styles.filterbox}>The content of the Popover.</div>
                </Popover>
              </div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "40vw" },
                }}
                noValidate
                autoComplete="off"
              >
                <Autocomplete
                  disablePortal
                  id="fullWidth"
                  options={fetchedTitles}
                  onInputChange={(e, newInputValue) =>
                    searchEntries(newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Search by Title" />
                  )}
                />
              </Box>
              <Box
                sx={{
                  marginLeft: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <FormControl sx={{ width: "200px" }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} label="Sort By" onChange={orderBy}>
                    {_.without(moduleKeys, "coverImage", "links").map(
                      (e, i) => {
                        return (
                          <MenuItem value={e} key={e}>
                            {e
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, function (e) {
                                return e.toUpperCase();
                              })}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Box>
            </div>
          ) : null}
          <div id={styles.moduleContainer}>
            {fetchedData.map((e1, i1) => {
              let currentTitle = e1.title.replace(/\s+/g, "-").toLowerCase();
              return (
                <div
                  className={
                    entriesMarkedAsFinished[currentlyOpenedModule].includes(
                      currentTitle
                    )
                      ? styles.cardFinished
                      : styles.cardUnfinished
                  }
                  id={currentTitle + "-card"}
                  key={"1" + i1}
                >
                  {moduleKeys.map((e2, i2) => {
                    let currentKey = moduleKeys[i2];
                    let currentValue = e1[currentKey];
                    return (
                      <div key={"2" + i2}>
                        {currentKey === "coverImage" ? (
                          <div className={styles.coverImageContainer}>
                            <img
                              className={styles.coverImage}
                              src={currentValue}
                            />
                          </div>
                        ) : currentKey === "links" ? (
                          <div className={styles.linksContainer}>
                            {Object.keys(currentValue).map((e3, i3) => {
                              return (
                                <a
                                  href={currentValue[e3].link}
                                  key={"3" + i3}
                                  rel="nofollow noopener"
                                >
                                  <img
                                    src={currentValue[e3].icon}
                                    style={{
                                      width: "35px",
                                      aspectRatio: "1/1",
                                      objectFit: "cover",
                                      margin: "10px",
                                      padding: "5px",
                                    }}
                                  />
                                </a>
                              );
                            })}
                          </div>
                        ) : currentKey === "canonicity" ? null : (
                          <h2>{currentKey.replace(/([A-Z])/g, " $1")}:</h2>
                        )}
                        {typeof currentValue === "string" &&
                        currentKey !== "coverImage" ? (
                          <p>{currentValue}</p>
                        ) : null}
                        {currentKey === "canonicity" ? (
                          currentValue ? (
                            <div className={styles.canonDiv}>
                              <h3 className={styles.canon}>Canon</h3>
                            </div>
                          ) : (
                            <div className={styles.legendsDiv}>
                              <h3 className={styles.legends}>Legends</h3>
                            </div>
                          )
                        ) : null}
                      </div>
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
