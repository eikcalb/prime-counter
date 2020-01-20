import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Prime } from './lib/prime';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


test('should check if number is prime', () => {
  const sample = [
    { number: 2, prime: true },
    { number: 4, prime: false },
    { number: 9, prime: false },
    { number: 25, prime: false }
  ]

  let prime = new Prime(10)
  sample.forEach(entry => {
    const result = prime.primeChecker({ number: entry.number })
    expect(result).toEqual(entry.prime)
  })
})

test('Generate prime numbers', async () => {
  const prime = new Prime(10)
  const primes = await prime.generatePrimes(20)
  console.log('Generated primes:', primes)
  expect(primes).toContain(2, 3, 5)
})

test('Will generate 2D array of products', async () => {
  const prime = new Prime(10)
  await prime.generatePrimes()

  const res = await prime.createTable((x, y, value) => {
    expect(value).toEqual((prime.primes[x] * prime.primes[y]))
  })
  console.log(res)
})
