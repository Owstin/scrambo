const shift = (a, v) => a.concat(a).slice(v, v + a.length);

const swap = (a, i, j) => {
  let tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

const sum = array => array.reduce((a, b) => a + b);

// creates 2 dimensional array where the base has length1 and each element array has length2
const createArray = (length1, length2) => {
  let result = Array(length1);
  for (let i = 0; i < length1; result[i++] = Array(length2));
  return result;
}

export {
  shift,
  swap,
  sum,
  createArray
}
