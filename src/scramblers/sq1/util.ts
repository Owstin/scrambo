export function get8Perm(arr: any[]) {
  var i, idx, v, val;
    idx = 0;
    val = 1985229328;
    for (i = 0; i < 7; ++i) {
      v = arr[i] << 2;
      idx = (8 - i) * idx + (~~val >> v & 7);
      val -= 286331152 << v;
    }
    return idx & 65535;
}

export function bitCount(x: number) {
  x -= ~~x >> 1 & 1431655765;
  x = (~~x >> 2 & 858993459) + (x & 858993459);
  x = (~~x >> 4) + x & 252645135;
  x += ~~x >> 8;
  x += ~~x >> 16;
  return x & 63;
}

export function binarySearch(sortedArray: any[], key: number) {
  var high, low, mid, midVal;
  low = 0;
  high = sortedArray.length - 1;
  while (low <= high) {
    mid = low + (~~(high - low) >> 1);
    midVal = sortedArray[mid];
    if (midVal < key) {
      low = mid + 1;
    }
    else if (midVal > key) {
      high = mid - 1;
    }
    else {
      return mid;
    }
  }
  return -low - 1;
}
