import React from 'react'
import styles from "../styles/TimelineWarning.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';
import { faRebel } from '@fortawesome/free-brands-svg-icons';


export default function TimelineWarning() {
  return (
    <div className={styles.timelineWarningContainer} lang="en"><b>IMPORTANT TO KNOW:</b> 
    <ul>
        <li><FontAwesomeIcon icon={faJedi}  color="#ffe81f"/> A few books are missing their timeline data, therefore they appear at the end of the list.</li>
        <li><FontAwesomeIcon icon={faJedi}  color="#ffe81f"/> Books set in the same year are sorted by publication date.</li>
        <ul>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> This doesn't necessarily mean they come after one another storywise.</li>
        </ul>
        <li><FontAwesomeIcon icon={faJedi}  color="#ffe81f"/> Books that were published in the The Essential Legends Collection appear twice.</li>
        <ul>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> The original edition has the correct place in the list.</li>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> Use the exclude button to hide the Essential Legends version.</li>
        </ul>
    </ul>
    </div>
  )
}
