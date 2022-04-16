import React from 'react';
import { CardProps, EntryData, MarkedEntries } from '../../types';
import CardContents from './CardContents';
import styles from '../../styles/Home.module.css';

export default function Card({
  moduleKeys,
  e1,
  i1,
  excludeEntry,
  entriesMarkedAsFinished,
  toggleEntryAsFinished,
  currentlyOpenedModule,
  currentTitle,
}: CardProps) {
  return (
    <div
      className={
        entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle)
          ? `${styles.cardFinished} entryCard cardFinished`
          : `${styles.cardUnfinished} entryCard cardUnfinished`
      }
      id={currentTitle + '-card'}
      key={'1' + i1}
    >
      {moduleKeys.map((e2: string, i2: number) => {
        let currentKey = moduleKeys[i2];
        let currentValue = e1[currentKey as keyof EntryData];
        return (
          <CardContents
            i2={i2}
            currentKey={currentKey}
            currentValue={currentValue}
            key={i2}
            excludeEntry={excludeEntry}
            currentTitle={currentTitle}
          />
        );
      })}
      <button
        onClick={(e) => toggleEntryAsFinished(e1)}
        className={styles.finishedBtn}
        id={e1.title.replace(/\s+/g, '-').toLowerCase() + 'btn'}
      >
        {entriesMarkedAsFinished[
          currentlyOpenedModule as keyof MarkedEntries
        ]?.includes(currentTitle)
          ? 'Mark as Unfinished'
          : 'Mark as Finished'}
      </button>
    </div>
  );
}
