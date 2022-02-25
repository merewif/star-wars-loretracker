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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Popover from "@mui/material/Popover";
import FilterListIcon from "@mui/icons-material/FilterList";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

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

  function filterEntries(value, source) {
    let canonicityParameter = canonicityFilterValue;
    let creatorsParameters = filteredCreatorsName;
    let finishedParameter = finishedFilterValue;
    let erasParameters = filteredEras;

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
        let result = _.filter(defaultFetchedData, { title: title });
        listFilteredByFinished.push(result);
      }
      filteredResults = listFilteredByFinished;
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
        let entriesByPerson = _.filter(
          filteredResults,
          {
            author: person,
          } || { directedBy: person } || {
              createdBy: person,
            }
        );
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
                  <div id={styles.filterbox}>
                    <h3>Filters</h3>
                    <div
                      style={{
                        marginLeft: "15px",
                        textAlign: "center",
                      }}
                    >
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={canonicityFilterValue}
                          onChange={(e) => {
                            filterEntries(e.target.value, "canonicity");
                          }}
                        >
                          <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="All"
                          />
                          <FormControlLabel
                            value="legends"
                            control={<Radio />}
                            label="Legends"
                          />
                          <FormControlLabel
                            value="canon"
                            control={<Radio />}
                            label="Canon"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div style={{ marginLeft: "15px", textAlign: "center" }}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={finishedFilterValue}
                          onChange={(e) => {
                            filterEntries(e.target.value, "finished");
                          }}
                        >
                          <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="All"
                          />
                          <FormControlLabel
                            value="finished"
                            control={<Radio />}
                            label="Finished"
                          />
                          <FormControlLabel
                            value="unfinished"
                            control={<Radio />}
                            label="Unfinished"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel>Creators</InputLabel>
                        <Select
                          multiple
                          value={filteredCreatorsName}
                          onChange={(e) => {
                            filterEntries(e.target.value, "creators");
                          }}
                          input={<OutlinedInput label="Creators" />}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {creators.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox
                                checked={
                                  filteredCreatorsName.indexOf(name) > -1
                                }
                              />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel>Eras</InputLabel>
                        <Select
                          multiple
                          value={filteredEras}
                          onChange={(e) => {
                            filterEntries(e.target.value, "eras");
                          }}
                          input={<OutlinedInput label="Eras" />}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {eras.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox
                                checked={filteredEras.indexOf(name) > -1}
                              />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div
                      style={{ width: "100%", textAlign: "center" }}
                      id={styles.filterResetBtnContainer}
                    >
                      <Button variant="contained" onClick={resetFilters}>
                        Reset
                      </Button>
                    </div>
                  </div>
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
                  freeSolo
                  id="fullWidth"
                  options={fetchedTitles}
                  inputValue={searchValue}
                  onInputChange={(e, newValue) => {
                    setSearchValue(newValue);
                    searchEntries(newValue);
                  }}
                  onChange={(e, newInputValue) => {
                    searchEntries(newInputValue);
                    setSearchValue(newInputValue);
                  }}
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
              let currentTitle = e1.title.replace(/\s+/g, "-");
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
