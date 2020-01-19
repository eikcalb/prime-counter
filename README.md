# Prime Counter

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
