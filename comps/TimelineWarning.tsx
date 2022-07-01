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
        <li><FontAwesomeIcon icon={faJedi}  color="#ffe81f"/> Books that cover multiple years display only the last year the story is set in.</li>
        <ul>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> For example the Lost Tribe of the Sith is set between 5000 BBY-2975 BBY.</li>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> We decided to display only the final date and omit the first, as most of the times the starting date refers to flashbacks.</li>
            <li><FontAwesomeIcon icon={faRebel} color="#ffe81f" /> This was required to give them a definite place in the list and make sorting them possible but it might cause some confusion.</li>
        </ul>
    </ul>
    </div>
  )
}
