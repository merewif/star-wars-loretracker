import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "../../styles/Home.module.css";
import { useFilterContext } from "../../utils/useFilterContext";

export default function Searchbar() {
  const { fetchedTitles, searchValue, searchEntries } = useFilterContext();

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "40vw" },
      }}
      noValidate
      className={styles.searchbar}
    >
      <Autocomplete
        disablePortal
        freeSolo
        id="fullWidth"
        options={fetchedTitles}
        inputValue={searchValue}
        onInputChange={(e, newValue) => {
          searchEntries(newValue);
        }}
        onChange={(e, newInputValue) => {
          searchEntries(newInputValue);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search by Title"
            sx={{ fontFamily: "Montserrat", color: "white" }}
          />
        )}
        className={styles.autocomplete}
      />
    </Box>
  );
}
