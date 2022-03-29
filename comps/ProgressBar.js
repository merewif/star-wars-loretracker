import React, { useLayoutEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import styles from "../styles/ProgressBar.module.css";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 25,
  borderRadius: 50,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  margin: "auto",
  width: "80vw",
  boxShadow: "0px 0px 8px 8px #69D8F0, inset 0px 0px 20px 50px #69D8F0",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "transparent",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: theme.palette.mode === "light" ? "#fff" : "#fff",
    //  boxShadow: "0px 0px 8px 8px #69D8F0, inset 0px 0px 20px 8px #69D8F0",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
}));

export default function ProgressBar({ progressBarValue }) {
  return (
    <div className={styles.progressBarContainer}>
      <img src="./imgs/hilt.png" />
      <BorderLinearProgress variant="determinate" value={progressBarValue} />
      <p>{Math.round(progressBarValue)}% FINISHED</p>
    </div>
  );
}
