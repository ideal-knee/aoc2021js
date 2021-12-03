const { readFile } = require("fs").promises;

const filter = (filterFn, iterable) => reiterate(function* () {
  for (const element of iterable) {
    if (filterFn(element)) {
      yield(element);
    }
  }
});

const getArgs = () => process.argv.slice(2);

const range = (...args) => {
  let start, end;
  if (args.length === 1) {
    start = 0;
    [ end ] = args;
  } else if (args.length === 2) {
    [ start, end ] = args;
  } else {
    throw "Can't handle this many arguments... yet.";
  }
  return reiterate(function* () {
    for (let i = start; i < end; ++i) {
      yield i;
    }
  });
};

// TODO handle multiple iterables
const reduce = (initialValue, reduceFn, iterable) => {
  let value = initialValue;
  for (const element of iterable) {
    value = reduceFn(value, element);
  }
  return value;
};

// Allow more than one iteration
const reiterate = (iterator) => {
  const instance = iterator();
  instance[Symbol.iterator] = iterator;
  return instance;
};

const slurp = async (fileName) => (await readFile(fileName)).toString();

const slurpLines = async (fileName) => (await slurp(fileName)).trim().split("\n");

const thread = (initial, ...fns) => fns.reduce((previousResult, fn) => fn(previousResult), initial);

module.exports = { filter, getArgs, range, reduce, slurp, slurpLines, thread };
