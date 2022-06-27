import React, { useLayoutEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import styles from '../styles/ProgressBar.module.css';
import { ProgressBarProps } from '../types';

export default function ProgressBar({ progressBarValue }: ProgressBarProps) {
  const [saberColor, setSaberColor] = useState('#69D8F0');

  function toggleSaberColor() {
    if (saberColor === '#69D8F0') setSaberColor('#F40001');
    if (saberColor === '#F40001') setSaberColor('#69D8F0');
  }
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 25,
    borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    margin: 'auto',
    width: '80vw',
    boxShadow: `0px 0px 8px 8px ${saberColor}, inset 0px 0px 20px 50px ${saberColor}`,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: 'transparent',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#fff',
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
  }));
  return (
    <div className={styles.progressBarContainer}>
      <img src='./imgs/hilt.png' onClick={toggleSaberColor} className={styles.lightsaberHilt}/>
      <BorderLinearProgress variant='determinate' value={progressBarValue} />
      <p>{Math.round(progressBarValue)}% FINISHED</p>
    </div>
  );
}
