# Prime Counter

## How to run

The native code (Golang), has already been compiled into the `build` folder.
This is a WebAssembly executable and should run on all supporting machines without modification.
However, if required, the source code can be found in the `go` folder in the root directory.

To run the application, you must have:

- nodejs 8+
- npm or yarn

### Steps

- Clone repository using `git clone https://github.com/eikcalb/prime-counter.git`
- Enter the project directory and run:
  - `npm start` to run the application in your default browser.
    **NOTE:** Chrome is my most reommended choice as this was used in development :D.

## Logic

The design is inspired by this documentation: [Simple test for prime numbers](https://en.wikipedia.org/wiki/Primality_test#Simple_methods).
Which provides the following assumptions:

- Any number less than 2 is not a prime.
- Any number divisible by 2 or 3 is not a prime.
- Any number divisible by a number less than or equal to its square root is not prime.
- Prime numbers are usually separated among other numbers by 6 +- 1.

**NOTE** Negative numbers are not considered by this application.

Displaying the result make the following assumptions:

- All elements in the table is uniquely identified by their cartesian coordinated.
  - This way, the table is generated and populated from code, possible running from a different process.

## WebAssembly

The WebAssembly module of this application is written in Golang.
It implements the [above listed assumptions](#Logic) using loops.

### Benchmark

Running the benchmark without adding 6 per loop, produced:

- goos: windows
- goarch: amd64
- pkg: eikcalb.dev/prime/lib

| Name                      | Bench size | rate        | size   | time spent |
| ------------------------- | ---------- | ----------- | ------ | ---------- |
| BenchmarkPrimeGenerator-4 | 240050     | 25822 ns/op | 8 B/op | 6.318s     |
| BenchmarkPrimeGenerator-4 | 1000000    | 5166 ns/op  | 8 B/op | 5.244s     |

## JavaScript

The JavaScript module has implemented the [above assumptions](#Logic) using recursion.

## Observation

Running with a count of 1000 fails to generate primes in js using Chrome (Version 79.0.3945.117 (Official Build) (64-bit)).
However, it gets generate when on WebAssembly build.
