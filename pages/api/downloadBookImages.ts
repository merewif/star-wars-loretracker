import https from "https";
import fs from "fs";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { YoutiniData } from "../../types";

type Image = { name: string; image: string };

const downloadFile = (name: string, url: string): void => {
  const filePath = `./public/imgs/fetchedimgs/bookimages/${name
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}`;
  const file = fs.createWriteStream(filePath, { flags: "wx" });

  https.get(url, (response) => {
    response.pipe(file);
    response.on("end", () => {
      console.log(`${name} downloaded.`);
      file.close();
    });
    response.on("error", (err) => {
      console.error(`Error downloading file ${name}: ${err.message}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file ${filePath}: ${err.message}`);
        }
      });
      file.close();
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let fetchedData: Array<Array<YoutiniData>> | undefined;
  let images: Image[] = [];

  const canonBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Canon%20Books.json",
  );
  const legendBooks = await fetch(
    "https://star-wars-loretracker.vercel.app/data/books/Youtini%20Bookshelf%20-%20Legends%20Books.json",
  );

  await Promise.all([canonBooks, legendBooks])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          return response.json();
        }),
      );
    })
    .then((datas: Array<Array<YoutiniData>>) => {
      fetchedData = datas;
    })
    .catch((error) => {
      throw error;
    });

  if (!fetchedData) {
    console.log("Book json data not found.");
    return;
  }

  for await (const data of _.flatten(fetchedData)) {
    images.push({
      name: data["Name (Title)"],
      image: data["Cover Image URL"].toString(),
    });
  }

  let count = 0;
  const intervalId = setInterval(() => {
    if (count >= images.length) {
      clearInterval(intervalId);
      return;
    }
    downloadFile(images[count].name, images[count].image);
    count++;
  }, 250);

  console.log(images.length);
  res.json(images);
}
