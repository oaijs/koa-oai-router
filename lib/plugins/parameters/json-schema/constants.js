// Some older versions of Node don't define these constants
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

const MAX_VALUE = Number.MAX_VALUE;
const MIN_VALUE = Number.MIN_VALUE;
const EPSILON = Number.EPSILON;

// Numeric type ranges
const RANGES = {
  int32: {
    min: -2147483648,
    max: 2147483647,
  },

  int64: {
    min: MIN_SAFE_INTEGER,
    max: MAX_SAFE_INTEGER,
  },

  float: {
    min: -3.402823e38,
    max: 3.402823e38,
  },

  double: {
    min: MIN_VALUE,
    max: MAX_VALUE,
  },

  byte: {
    min: 0,
    max: 255,
  },
};

export {
  MIN_SAFE_INTEGER,
  MAX_SAFE_INTEGER,
  MIN_VALUE,
  MAX_VALUE,
  EPSILON,
  RANGES,
};
