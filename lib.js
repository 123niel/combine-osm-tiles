import fs from "fs";
import fetch from "node-fetch";

export const getPoly = (x1, y1, x2, y2) => ({
  type: "Polygon",
  coordinates: [
    [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
      [x1, y1],
    ],
  ],
});

export const download = async (filename, url) => {
  const res = await fetch(url);
  const file = fs.createWriteStream(filename);

  await new Promise((resolve, reject) => {
    res.body?.pipe(file);
    res.body?.on("error", reject);
    file.on("finish", resolve);
  });
};

export const deleteFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, () => resolve(true));
  });
};

export const createDir = (dirName) => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
};
