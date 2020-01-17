package prime

import (
	"errors"
	"fmt"
	"math"
	"syscall/js"
)

var (
	// run is used to prevent application from aborting while WebAssembly session is active.
	run chan bool
)

/*
Prime contains the logic of prime number generation in golang.

The purpose of this struct is to manage the creation of tables containing the prime numbers.
*/
type Prime struct {
	PrimeCount int
	Primes     []uint64
}

/*
New returns a new instance of Prime
*/
func New(numberOfPrimes int) *Prime {
	return &Prime{PrimeCount: numberOfPrimes}
}

/*
IsPrime checks if the provided number is a prime number
*/
func (p *Prime) IsPrime(num uint64) bool {
	if num > math.MaxUint64 {
		fmt.Println("Possible stack overflow!")
		return false
	}
	// 1 is not a prime number
	// @link{https://primes.utm.edu/notes/faq/one.html}
	//
	// function does not work for negative numbers.
	if num < 2 {
		return false
	}

	// Loop through an increment count using the square root of provided number.
	// If provided number can have square root divisible by any number other than 1, it is definitely not prime.
	for i, sq := uint64(2), uint64(math.Floor(math.Sqrt(float64(num)))); i <= sq; i++ {
		//fmt.Printf("\tSquare root is %v;\ti is %v\r\n", sq, i)
		if uint64(num)%i == 0 {
			return false
		}
	}
	return true
}

func (p *Prime) GeneratePrimes() {
	p.Primes = make([]uint64, p.PrimeCount)

	for i, number := 0, uint64(2); i < p.PrimeCount; number++ {
		// the nested array should be same size as parent array.
		if p.IsPrime(number) {
			/** TOO COMPLEX
			-----------------
			REVISIT LATER
			-----------------
			// for each prime number, add the number to result array.
			for x:=1;x <= i+1;x++{
				result[i][current]
			*/

			//fmt.Printf("%v is a prime.\r\nSet value at index %v\r\n", number, y)
			p.Primes[i] = number
			i++
		}
	}
}

/*
CreateTable generates 2D array of Prime products.
*/
func (p *Prime) CreateTable(callback func(x, y int, val uint64)) ([][]uint64, error) {

	if p.Primes == nil {
		return nil, errors.New("Primes not generated yet")
	}

	result := make([][]uint64, p.PrimeCount)

	//fmt.Printf("Before generator: %v", result)

	for y := 0; y < len(p.Primes); y++ {
		result[y] = make([]uint64, p.PrimeCount)
		for x := 0; x < len(result[y]); x++ {
			result[y][x] = p.Primes[y] * p.Primes[x]
			callback(x, y, result[y][x])
		}
	}

	return result, nil
}

func (p *Prime) inflateTable(this js.Value, args []js.Value) interface{} {
	doc := js.Global().Get("document")
	var result [][]uint64
	go func() {
		p.GeneratePrimes()
		res, err := p.CreateTable(func(x, y int, val uint64) {
			// The table element should be available.
			//
			// Cels in the table must be identified by cartesian coordinates.
			cell := doc.Call("getElementById", fmt.Sprintf("%v%v", x, y))
			cell.Set("innerText", val)
		})
		if err != nil {
			doc.Call("getElementById", "status").Set("innetText", err.Error())
			return
		}

		result = res
	}()

	return result
}

func (p *Prime) Start() {
	// register callbacks and expose JS functions here.
	functions := map[string]js.Func{"iftF": js.FuncOf(p.inflateTable)}

	js.Global().Set("golangInflateTable", functions["iftF"])
	<-run
	for _, funct := range functions {
		js.Func(funct).Release()
	}
}

func (p *Prime) Stop() {
	js.Global().Set("golangInflateTable", nil)
	run <- false
}
