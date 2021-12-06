const { readFile } = require("fs").promises;

const filter = (filterFn, iterable) => reiterate(function* () {
  for (const element of iterable) {
    if (filterFn(element)) {
      yield(element);
    }
  }
});

const first = (iterable) => iterable.next().value;

const flatten = (iterable) => reiterate(function* () {
  for (const element of iterable) {
    for (const subElement of element) {
      yield subElement;
    }
  }
});

const getArgs = () => process.argv.slice(2);

const map = (fn, iterable) => reiterate(function* () {
  for (const element of iterable) {
    yield fn(element);
  }
});

const partition = (n, iterable) => reiterate(function* () {
  let part = [];
  for (const element of iterable) {
    part.push(element);
    if (part.length === n) {
      yield part;
      part = [];
    }
  }
  if (part.length > 0) {
    yield part;
  }
});

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

const realize = (iterable) => {
  const result = [];
  for (const element of iterable) {
    result.push(element);
  }
  return result;
}

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

module.exports = { filter, first, flatten, getArgs, map, partition, range, realize, reduce, slurp, slurpLines, thread };
