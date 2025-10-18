self.onmessage = (e) => {
  const value = Number(e.data);
  const result = fibonacci(value)
  self.postMessage(result); // communicate result back to main thread
};

function fibonacci(num: number) {
  let a = 1, b = 0;
  while (num > 0) {
    [a, b] = [a + b, a];
    num--;
  }
  return b;
}