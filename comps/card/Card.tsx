import React, { useEffect, useState } from 'react';
import { CardProps, EntryData, MarkedEntries } from '../../types';
import CardContents from './CardContents';
import styles from '../../styles/Home.module.css';
import DescriptionDialog from "../MUI/DescriptionDialog"

export default function Card({
  moduleKeys,
  e1,
  excludeEntry,
  entriesMarkedAsFinished,
  toggleEntryAsFinished,
  currentlyOpenedModule,
  currentTitle,
  getDescription
}: CardProps) {
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const desc = getDescription(e1.title);
    setDescription(desc);
  }, [e1]);

  return (
    <div
      className={
        entriesMarkedAsFinished[currentlyOpenedModule].includes(currentTitle)
          ? `${styles.cardFinished} entryCard cardFinished ${e1.canonicity ? styles.canonicityTrue : styles.canonicityFalse}`
          : `${styles.cardUnfinished} entryCard cardUnfinished ${e1.canonicity ? styles.canonicityTrue : styles.canonicityFalse}`
      }
      id={currentTitle + '-card'}
    >
      <div className={styles.cardText}>
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
      </div>
      <DescriptionDialog title={e1.title} description={description}/>
      <button
        onClick={(e) => toggleEntryAsFinished(e1)}
        className={styles.finishedBtn}
        id={e1.title.replace(/\s+/g, '-').toLowerCase() + 'btn'}
      >
        {entriesMarkedAsFinished[currentlyOpenedModule as keyof MarkedEntries]?.includes(currentTitle)
          ? 'Mark as Unfinished'
          : 'Mark as Finished'}
      </button>
    </div>
  );
}
