const combineTiles = require("combine-tiles");
const fs = require("fs");
const https = require("https");

// const [x, y, z] = tileBelt.bboxToTile([
//   "49.3312",
//   "10.0214",
//   "49.3223",
//   "10.0463",
// ]);

const download = async (filename, url) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => file.close(resolve()));
      })
      .on("error", (err) => {
        fs.unlink(filename);
        reject();
      });
  });
};

z = 18;
const bounds = [
  { x: 138364, y: 89655 },
  { x: 138386, y: 89668 },
];

const dx = bounds[1].x - bounds[0].x;
const dy = bounds[1].y - bounds[0].y;

const tiles = [];

(async () => {
  for (let x = 0; x <= dx; x++) {
    for (let y = 0; y <= dy; y++) {
      const url = `https://tile.openstreetmap.de/${z}/${x + bounds[0].x}/${
        y + bounds[0].y
      }.png`;

      const filename = `tiles/${x}-${y}.png`;

      await download(filename, url);

      tiles.push({
        x,
        y,
        file: filename,
      });
    }
  }

  const dest = "out.png";
  const size = 512;

  combineTiles(tiles, size, size, dest).then(() => console.log("done"));
})().then(console.log("done"));
