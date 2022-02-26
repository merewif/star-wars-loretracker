import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
  const [entryName, setEntryName] = useState("");
  const [review, setReview] = useState("");
  const [reviewList, setReviewList] = useState([]);

  function submitInputs(e, input) {
    e.preventDefault();
    axios
      .post("http://localhost:2999/api/insert", {
        entryName: entryName,
        review: review,
      })
      .then(() => {
        alert("Successful insert");
      });
  }

  useEffect(() => {
    axios
      .get("http://localhost:2999/api/get")
      .then((response) => setReviewList(response.data));
  }, []);

  return (
    <div>
      Star Wars Reviews
      <form>
        <input
          type="text"
          name="movieName"
          onChange={(e) => setEntryName(e.target.value)}
        />
        <input
          type="text"
          name="review"
          onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={(e) => submitInputs(e, e.target.value)}>Submit</button>
      </form>
      {reviewList.map((e, i) => {
        return (
          <div key={i}>
            <h3>{e.movieName}</h3>
            <p>{e.movieReview}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Reviews;
