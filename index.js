import { tiles } from "@mapbox/tile-cover";
import combineTiles from "combine-tiles";

import { getPoly, download, deleteFile, createDir } from "./lib.js";

// coords of two edge points (x1, y1, x2, y2)
const poly = getPoly(10.0214, 49.3312, 10.0463, 49.3223);
// zoom level (https://wiki.openstreetmap.org/wiki/Zoom_levels)
const z = 18;

const destFilename = `out-z${z}.png`;
const size = 256;

const main = async () => {
  const tileArray = [];

  const tileCover = tiles(poly, { min_zoom: z, max_zoom: z });
  const maxX = Math.max(...tileCover.map(([x, _]) => x));
  const minX = Math.min(...tileCover.map(([x, _]) => x));
  const dx = maxX - minX;
  const maxY = Math.max(...tileCover.map(([_, y]) => y));
  const minY = Math.min(...tileCover.map(([_, y]) => y));
  const dy = maxY - minY;

  createDir("tiles");

  const count = tileCover.length;
  let i = 0;
  for (let x = 0; x <= dx; x++) {
    for (let y = 0; y <= dy; y++) {
      const url = `https://tile.openstreetmap.de/${z}/${x + minX}/${
        y + minY
      }.png`;

      const filename = `tiles/${x}-${y}.png`;

      await download(filename, url);

      tileArray.push({
        x,
        y,
        file: filename,
      });
      i++;
      console.log(`downloaded tile ${url} (${i}/${count})`);
    }
  }

  await combineTiles(tileArray, size, size, destFilename);

  for (const { file } of tileArray) {
    await deleteFile(file);
  }
};

const start = new Date();
main().then(() => console.log(`done after ${new Date() - start}ms`));
