const { getArgs, range, reduce, slurpLines } = require("./common");

const [ inputFile ] = getArgs();

const main = async () => {
  const depths = (await slurpLines(inputFile)).map((line) => parseInt(line));

  // Part 1
  const { part1Count } = depths.reduce(
    ({ previousDepth, part1Count }, depth) => ({
      previousDepth: depth,
      part1Count: previousDepth && depth > previousDepth ? part1Count + 1 : part1Count,
    }),
    { part1Count: 0 }
  );
  console.log(part1Count);

  // Part 2
  const part2Count = reduce(
    0,
    (count, i) => depths[i - 3] < depths[i] ? count + 1 : count,
    range(3, depths.length)
  );
  console.log(part2Count);
};

main();
