import { Prime } from "./prime";

/**
 * Base class for run contexts.
 */
class Base {
    /**
     * This confirms dependencies and checks if funtionality provided is supported.
     */
    constructor() {
        this.run()
    }
    /**
     * `run` contains the switch for triggering application context logic.
     * Subclasses must implement this method.
     */
    async run() {
        throw new Error("Not implemented yet!")
    }

    async inflateTable() {
        throw new Error("Not yet implemented!")
    }

    async getPrimes() {
        throw new Error("Not yet implemented!")
    }

    async setPrimeCount() {
        throw new Error("Not yet implemented!")
    }

    stop() {
        throw new Error("Not implemented yet!")
    }
}


export class JSContext extends Base {
    prime = new Prime(10)

    // Apparently, this requires base JavaScript functionality.
    // Should work fine across many browsers.
    async run() {
        console.log('JSContext running!')
    }

    async inflateTable() {
        this.prime.generatePrimes()
        this.prime.createTable((x, y, value) => {
            // callback to inflate values to table.
            // The table cells must already exist.
            const el = document.getElementById(`x${x}y${y}`)
            if (!el) return // silently continue
            el.innerText = value
        })
    }

    async getPrimes() {
        return this.prime.primes || await this.prime.generatePrimes()
    }

    async setPrimeCount(count) {
        this.prime.primeCount = count >= 1 ? count : 1
        return await this.prime.generatePrimes()
    }

    stop() {
        console.log("Stopped JS context!")
    }
}

export class WorkerContext extends Base {
    worker = null

    constructor() {
        // Confirm WebWorker support.
        if (!("Worker" in window) || typeof Worker !== "function") throw new Error("Cannot initialize WebWorker!")
    }

    async run() {
        const worker = new Worker(`${process.env.PUBLIC_URL}/worker.js`)
        // worker.
    }

    stop() {
        this.worker.terminate()
    }
}

export class GOContext extends Base {
    // Local variable for storing WASM instance.
    go
    static instance = null

    constructor() {
        // Confirm WASM dependency.
        //
        // For some unknown reason, Edge browser does not support Golang WASM module.
        // ... oh well!
        if (!!WebAssembly && "Go" in global && typeof global.Go === 'function') {
            // Golang dependencies are available!
            super()
        } else {
            // Required dependencies not available!
            throw new Error("Cannot initialize Go application!")
        }
    }

    async run() {
        let go
        if (!this.go) {
            go = new window.Go();
            this.go = go
        } else {
            go = this.go
        }

        return WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
            GOContext.instance = result.instance
            go.run(GOContext.instance);
        });
    }

    async inflateTable() {
        return window.golangInflateTable()
    }

    async getPrimes() {
        return global.golangGetPrimes()
    }

    async setPrimeCount(count) {
        let counter = global.golangSetPrimeCount(count)
        console.log(counter, "Go res")
        return counter
    }

    stop() {
        if (!this.go.exited) {
            global.golangShutdown()
            GOContext.instance = null
            this.go.exit(0)
        }
    }
}