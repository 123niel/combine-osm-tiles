var cover = require("@mapbox/tile-cover");
var poly = {
  type: "Polygon",
  coordinates: [
    [
      [10.0214, 49.3312],
      [10.0463, 49.3312],
      [10.0463, 49.3223],
      [10.0214, 49.3223],
      [10.0214, 49.3312],
    ],
  ],
};
var limits = {
  min_zoom: 19,
  max_zoom: 19,
};

const tiles = cover.tiles(poly, limits);
const maxX = Math.max(...tiles.map(([x, _, _]) => x));
const maxY = Math.max(...tiles.map(([_, y, _]) => y));

(async () => {
  let x = 0;
  let y = 0;
  tiles.forEach(([x, y, z]) => {});

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
