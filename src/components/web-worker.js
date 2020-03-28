/* eslint-disable */
// self.addEventListener('message', ev => {
//   debugger;
//   console.log('Web Worker Started');
//   const iterations = ev.data;
//   console.log(iterations);
//   self.postMessage(iterations);
//   self.close();
// });
this.onmessage = function (e) {
  debugger;
  if (e.data.iterations !== undefined) {
    console.log('Message received from main script');
    const workerResult = 'Result';
    console.log('Posting message back to main script');
    postMessage(workerResult);
  }
};
