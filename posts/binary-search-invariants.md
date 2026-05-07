二分查找最容易出错的地方，不是 `mid` 怎么取，也不是 `left = mid + 1` 写在哪一边，而是我们没有先定义答案所在的区域。

### 先找谓词

很多题都可以改写成一个布尔函数 `check(x)`：当 `x` 足够大，条件成立；当 `x` 太小，条件不成立。于是数组被分成两段：

```text
false false false true true true
```

这时候我们要找的是第一个 `true`。循环不变量可以写成：答案始终在 `[left, right]` 里。

### 一个稳定写法

```js
while (left < right) {
  const mid = Math.floor((left + right) / 2);
  if (check(mid)) {
    right = mid;
  } else {
    left = mid + 1;
  }
}
```

这个写法的美感在于：每一次更新都没有丢掉可能答案。等 `left === right` 时，区间只剩一个点，它就是答案。
