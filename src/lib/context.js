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
    go = null

    constructor() {
        // Confirm WASM dependency.
        //
        // For some unknown reason, Edge browser does not support Golang WASM module.
        // ... oh well!
        if (!!WebAssembly && "Go" in Window && typeof window.Go === 'function') {
            // Golang dependencies are available!
            super()
        } else {
            // Required dependencies not available!
            throw new Error("Cannot initialize Go application!")
        }
    }

    async run() {
        let go = new window.Go();
        return WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });
    }

    stop() {
        this.go.exit()
    }
}