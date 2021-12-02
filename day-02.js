const { getArgs, slurpLines } = require("./common");

const [ inputFile ] = getArgs();

const parseLine = (line) => {
  const [ direction, amountString ] = line.split(" ");
  return {
    direction,
    amount: parseInt(amountString),
  };
};

const main = async () => {
  const commands = (await slurpLines(inputFile)).map(parseLine);

  const { x: part1x, y: part1y } = commands.reduce(
    ({ x, y }, { direction, amount }) => {
      return {
        "forward": { x: x + amount, y             },
        "down":    { x            , y: y + amount },
        "up":      { x            , y: y - amount },
      }[direction]
    },
    { x: 0, y: 0 }
  );
  console.log(part1x * part1y);

  const { x: part2x, y: part2y } = commands.reduce(
    ({ x, y, aim }, { direction, amount }) => {
      return {
        "forward": { x: x + amount, y: y + aim * amount, aim },
        "down":    { x            , y                  , aim: aim + amount },
        "up":      { x            , y                  , aim: aim - amount },
      }[direction]
    },
    { x: 0, y: 0, aim: 0 }
  );
  console.log(part2x * part2y);
};

main();
