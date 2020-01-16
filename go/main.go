package main

import (
	"syscall/js"
)

func main() {
	js.Global.Get("document").
		fmt.Println("Hello WebAssembly!")
}
