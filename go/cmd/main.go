package main

import (
	"eikcalb.dev/prime"
)

func main() {
	primeInstance := prime.New(10)
	prime.Console.Log(("Hello WebAssembly!"))
	primeInstance.Start()
}
