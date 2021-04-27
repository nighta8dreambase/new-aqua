var randomMC = require("random-material-color");
const rnd = 0.08685841587926357 || Math.random();
console.log("rnd", rnd);
export const GRAPH_COLOR = [
  "#2978ee",
  "#163272",
  "#f07215",
  "#e02916",
  "#ffca25",
  "#C0D3DF",
].concat(
  Array.from(Array(300).keys()).map((i) =>
    randomMC.getColor({
      shades: ["700", "500", "600"],
      text: (rnd + i).toString(),
    })
  )
);
