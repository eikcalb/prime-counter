package core

import (
	"fmt"
	"math/big"
	"testing"
)

var prime Prime = Prime{PrimeCount: 10}

func TestIsPrimes(t *testing.T) {
	sample := []struct {
		val      uint64
		expected bool
	}{
		{1, false},
		{2, true},
		{25, false},
		{11, true},
		{5, true},
		{6, false},
		{4, false},
		{31, true},
		{92, false},
		{91, false},
		{7, true},
		{105727, true},
		{907, true},
		{911, true},
		{709, true},
	}

	for i, val := range sample {
		t.Run(fmt.Sprintf("Test%v, is %v prime:", i, val.val), func(t *testing.T) {
			if res := prime.IsPrime(val.val); res != val.expected {
				t.Errorf("Prime not valid: %v should return %t, but returned %t,\r\n\tverified: %v", val.val, val.expected, res, big.NewInt(int64(val.val)).ProbablyPrime(0))
			}
		})
	}
}

func TestPrime(t *testing.T) {
	prime := &Prime{PrimeCount: 10}

	t.Run("Primes are nil before generation", func(t *testing.T) {
		if prime.Primes != nil {
			t.Errorf("Prime should be uninitialized until generated!")
		}
	})
}

func BenchmarkPrimeGenerator(b *testing.B) {
	prime.PrimeCount = b.N
	b.StartTimer()
	prime.GeneratePrimes()
	b.StopTimer()
	b.Logf("b.N was set to %v\r\n", prime.PrimeCount)
}
