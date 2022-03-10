import React from "react";
import styles from "../../styles/Home.module.css";

export default function LinksContainer({ currentValue }) {
  return (
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
  );
}
