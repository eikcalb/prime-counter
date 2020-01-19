package prime

import (
	"fmt"
	"syscall/js"

	core "eikcalb.dev/prime/lib"
)

type console js.Value

/*
	Log from Go to JS
*/
func (c console) Log(data interface{}) {
	js.Value(c).Call("log", data)
}

var Console console = console(js.Global().Get("console"))

var (
	// Console is a golang interface for writing to JavaScript console.

	// run is used to prevent application from aborting while WebAssembly session is active.
	run chan bool
)

/*
Prime contains the logic of prime number generation in golang using an underlying engine.
The purpose of this struct is to manage the creation of tables containing the prime numbers.
*/
type Prime struct {
	engine *core.Prime
}

/*
New returns a new instance of Prime
*/
func New(numberOfPrimes int) *Prime {
	return &Prime{
		engine: core.New(numberOfPrimes),
	}
}

func (p *Prime) inflateTable(this js.Value, args []js.Value) interface{} {
	doc := js.Global().Get("document")
	var result [][]uint64
	go func() {
		p.engine.GeneratePrimes()
		res, err := p.engine.CreateTable(func(x, y int, val uint64) {
			// The table element should be available.
			//
			// Cels in the table must be identified by cartesian coordinates.
			cell := doc.Call("getElementById", fmt.Sprintf("%v%v", x, y))
			cell.Set("innerText", val)
		})
		if err != nil {
			doc.Call("getElementById", "status").Set("innerText", err.Error())
			return
		}

		result = res
	}()

	return result
}

func (p *Prime) Start() {
	// register callbacks and expose JS functions here.
	functions := map[string]js.Func{
		"iftF": js.FuncOf(p.inflateTable),
		"shutdown": js.FuncOf(func(first js.Value, args []js.Value) interface{} {
			p.Stop()
			return nil
		}),
	}
	Console.Log("Starting Golang application...")

	js.Global().Set("golangInflateTable", functions["iftF"])
	js.Global().Set("golangShutdown", functions["shutdown"])
	Console.Log("...registering required functions on global object...")
	// Listen to signal from channel.
	// This will stop program execution.
	<-run

	// Shutdown all registered functions.
	for _, funct := range functions {
		js.Func(funct).Release()
	}
	Console.Log("...Shutting Down!")
}

/*
Stop stops the application execution by sending signal to channel.
*/
func (p *Prime) Stop() {
	js.Global().Set("golangInflateTable", nil)
	run <- false
}
