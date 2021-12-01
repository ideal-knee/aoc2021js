const { readFile } = require("fs").promises;

const getArgs = () => process.argv.slice(2);

const range = function* (...args) {
  let start, end;
  if (args.length === 1) {
    start = 0;
    [ end ] = args;
  } else if (args.length === 2) {
    [ start, end ] = args;
  } else {
    throw "Can't handle this many arguments... yet.";
  }
  for (let i = start; i < end; ++i) {
    yield i;
  }
};

// TODO handle multiple iterables
const reduce = (initialValue, reduceFn, iterable) => {
  let value = initialValue;
  for (const element of iterable) {
    value = reduceFn(value, element);
  }
  return value;
};

const slurp = async (fileName) => (await readFile(fileName)).toString();

const slurpLines = async (fileName) => (await slurp(fileName)).trim().split("\n");

module.exports = { getArgs, range, reduce, slurp, slurpLines };
