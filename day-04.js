const { filter, first, flatten, getArgs, map, partition, range, realize, reduce, slurpLines, thread } = require("./common");

const [ inputFile ] = getArgs();

// 1 arg version of parseInt
const parseInt1 = (s) => parseInt(s);

const isWinningCard = (card, drawnNumbers) => {
  const iCounts = new Array(5).fill(0);
  const jCounts = new Array(5).fill(0);
  for (const i of range(5)) {
    for (const j of range(5)) {
      if (card[i][j] in drawnNumbers) {
        ++iCounts[i];
        ++jCounts[j];
      }
    }
  }
  return Math.max(...iCounts, ...jCounts) === 5;
};

const main = async () => {
  const lines = await slurpLines(inputFile);
  const drawnNumbers = lines[0].split(",").map(parseInt1);
  const cards = thread(
    lines,
    ($) => $.slice(1),
    ($) => partition(6, $),
    ($) => map(
      (cardStrings) => thread(
        cardStrings,
        ($) => $.slice(1),
        ($) => $.map((line) => line.split(/\s+/).map(parseInt1)),
      ),
      $,
    ),
    realize,
  );
  for (const i of range(1, cards.length)) {
    const currentDrawnNumbers = drawnNumbers.slice(0, i);
    const winningCard = thread(
      cards,
      ($) => filter((card) => isWinningCard(card, currentDrawnNumbers), $),
      first,
    )
    if (winningCard) {
      const lastDrawn = currentDrawnNumbers.slice(-1)[0];
      const allUnmarkedSum = thread(
        winningCard,
        flatten,
        ($) => filter((number) => !currentDrawnNumbers.includes(number), $),
        ($) => reduce(0, (a, b) => a + b, $),
      )
      console.log(lastDrawn * allUnmarkedSum);
      break;
    }
  }
};

main();
