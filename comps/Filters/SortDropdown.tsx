import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import _ from "lodash";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import styles from "../../styles/Home.module.css";

export default function SortDropdown({ sortBy, orderBy, moduleKeys }) {
  const [order, setOrder] = useState("asc");
  const [sortParameter, setSortParameter] = useState("");
  useEffect(() => {
    sortWithOrderParameter();
  }, [order]);

  function sortWithOrderParameter() {
    orderBy(sortParameter, order);
  }

  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginTop: "auto",
        marginBottom: "auto",
        display: "flex",
        alignItems: "center",
      }}
      className={styles.sortByDropdown}
    >
      <FormControl sx={{ width: "200px" }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => {
            orderBy(e.target.value, order);
            setSortParameter(e.target.value);
          }}
        >
          {_.without(moduleKeys, "coverImage", "links").map((e, i) => {
            return (
              <MenuItem value={e} key={e}>
                {e.replace(/([A-Z])/g, " $1").replace(/^./, function (e) {
                  return e.toUpperCase();
                })}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {order === "asc" ? (
        <ArrowUpwardIcon
          onClick={() => setOrder("desc")}
          sx={{ fontSize: "2rem", cursor: "pointer" }}
        />
      ) : (
        <ArrowDownwardIcon
          onClick={() => setOrder("asc")}
          sx={{ fontSize: "2rem", cursor: "pointer" }}
        />
      )}
    </Box>
  );
}
