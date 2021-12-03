const { filter, getArgs, range, reduce, slurpLines, thread } = require("./common");

const [ inputFile ] = getArgs();

const findDiagnosticValue = (binaryNumbers, width, criteria) => thread(
  reduce(
    binaryNumbers,
    (binaryNumbers, i) => {
      const { count, total } = reduce(
        { count: 0, total: 0 },
        ({ count, total }, binaryNumber) => ({
          count: count + parseInt(binaryNumber[i]),
          total: total + 1,
        }),
        binaryNumbers,
      );
      if (total === 1) {
        return binaryNumbers;
      }
      const filterValue = criteria(count, total);
      return filter(
        (binaryNumber) => parseInt(binaryNumber[i]) === filterValue,
        binaryNumbers,
      );
    },
    range(width),
  ).next().value,
  (s) => parseInt(s, 2),
);

const main = async () => {
  const binaryNumbers = await slurpLines(inputFile);
  const width = binaryNumbers[0].length;

  // Part 1
  const counts = reduce(
    new Array(width).fill(0),
    (counts, binaryNumber) => reduce(
      counts,
      (counts, i) => {
        if (binaryNumber[i] === "1") {
          counts[i] += 1;
        }
        return counts;
      },
      range(width),
    ),
    binaryNumbers,
  );
  const gammaRate = parseInt(counts.map((count) => count > (binaryNumbers.length / 2) ? "1" : "0").join(""), 2);
  const epsilonRate = gammaRate ^ (2 ** width - 1);
  console.log(gammaRate * epsilonRate);

  // Part 2
  const oxygenGeneratorRating = findDiagnosticValue(
    binaryNumbers,
    width,
    (count, total) => count / total >= 0.5 ? 1 : 0,
  );
  const co2ScrubberRating = findDiagnosticValue(
    binaryNumbers,
    width,
    (count, total) => count / total >= 0.5 ? 0 : 1,
  );
  console.log(oxygenGeneratorRating * co2ScrubberRating);
};

main();
