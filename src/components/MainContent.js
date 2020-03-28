import React, {useCallback, useState} from 'react';
import logo from '../logo.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useWorker} from '@koale/useworker';

// Import your worker
// eslint-disable-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax

function calculatePrimes(iterations) {
  const multiplier = 1000000000;
  const primes = [];
  for (let i = 0; i < iterations; i++) {
    const candidate = i * (multiplier * Math.random());
    let isPrime = true;
    for (let c = 2; c <= Math.sqrt(candidate); ++c) {
      if (candidate % c === 0) {
        // not prime
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(candidate);
    }
  }
  return primes;
}

export const MainContent = () => {
  const [textReceived, settextReceived] = useState('...');
  const [primesWorker] = useWorker(calculatePrimes);
  const iterations = 1000;
  const workerInstance = worker();

  function updateText(text) {
    settextReceived(text);
  }

  // Attach an event listener to receive calculations from your worker
  workerInstance.addEventListener('message', message => {
    console.log('New Message: ', message.data);
    if (message.data && message.data.result) {
      updateText(message.data.result);
    }
  });

  if (window.Worker) {
    console.log('Web worker compatible');
  } else {
    console.log('Not compatible with web workers');
  }

  const handleClick = useCallback(() => {
    console.log('Starting operation');
    const primes = calculatePrimes(iterations);
    updateText(primes);
    console.log('Done');
  }, []);

  const handleClickWebWorker = useCallback(async () => {
    console.log('Starting operation');
    const primes = await primesWorker(iterations); // non-blocking UI
    updateText(primes);
    console.log('Done');
  }, [primesWorker]);

  const handleWorkerWorkerize = useCallback(() => {
    // Run your calculations
    console.log('Starting operation');
    workerInstance.calculatePrimes(500, iterations);
    // updateText(primes);
    console.log('Done');
  }, [workerInstance]);

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        <button onClick={handleWorkerWorkerize}><h3>Click Me to start worker!</h3></button>
        <br />
        <CircularProgress />
        <br />
        <h3>Text from the web worker:</h3>
        <h3>{textReceived}</h3>
      </div>
    </header>
  );
};

export default MainContent;
