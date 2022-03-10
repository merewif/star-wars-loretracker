import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import _ from "lodash";

export default function SortDropdown({ sortBy, orderBy, moduleKeys }) {
  return (
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
    </Box>
  );
}
