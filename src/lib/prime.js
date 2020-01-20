export class Prime {
    primeCount = 10
    primes = null

    constructor(count) {
        this.primeCount = count
        // create global instance.
        // Ideally, this should be placed in a separate npm package.
        // However, since the worker file dependent on this class will not be processed by webpack, this should be sufficient.
        // 
        // An alternative is passing the instance to the worker.
        global.primeInstance = this
    }

    /**
     * Use this function without passing any argument.
     * 
     * @param {number} count Number of primes to be generated.
     * @param {number[]} arrayList Array containing primes generated.
     * @param {number} current Current number being tested as a prime.
     */
    async generatePrimes(count, arrayList, current) {
        // console.log('gen args: ', arguments)
        arrayList = arrayList || []
        count = count || this.primeCount
        current = current || 2
        if (Number.MAX_SAFE_INTEGER < (current + 2)) throw new Error("Possible stackoverflow!")
        
        if (this.primeChecker({ number: current })) arrayList.push(current)

        if (arrayList.length < count) {
            return this.generatePrimes(count, arrayList, ++current)
        } else {
            this.primes = arrayList
            return arrayList
        }
    }

    /**
     * Checks if the provided number is a prime recursively.
     * 
     * This uses object reference to reduce posible increase in stack size.
     * 
     * **NOTE:** does not work with negative numbers.
     */
    primeChecker(obj) {
        if (obj.currentCount) {
            if (obj.currentCount <= obj.squareRt) {
                if (obj.number % obj.currentCount === 0 || obj.number % (obj.currentCount + 2) === 0) return false
                else {
                    obj.currentCount++
                    return this.primeChecker(obj)
                }
            } else {
                // Looped through all values less than equal to square root, yet no divisor found.
                // Number is prime!
                return true
            }
        }

        if (obj.number <= 3) return obj.number > 1
        else if (obj.number % 2 === 0 || obj.number % 3 === 0) return false

        obj.squareRt = parseInt(Math.sqrt(obj.number))
        // Start testing from 5 as 4 has been seived out in earlier statement.
        // This is the only modified property in `obj`.
        //
        // `obj` should be reused across invocation as JS objects are references.
        obj.currentCount = 5

        return this.primeChecker(obj)
    }

    /**
     * Creates 2D array containing prime products.
     * 
     * @param {function} callback Callback to be triggered for every loop.
     * @param {number[]} primes Array containing optional mock array. If absent, the object will use internal array list.
     */
    async createTable(callback, primes) {
        this.primes = primes || this.primes || this.generatePrimes()

        if (!this.primes || typeof this.primes !== 'object') {
            throw new Error("Primes not available to work with!")
        }

        let result = []
        this.primes.forEach((entry, y) => {
            result.push([...this._tableGenerator(y, callback)])
        })
        return result
    }

    /**
     * Given an index, this generates a list of products between this index and other numbers.
     * 
     * @param {number[]} index Current index to be multiplied.
     * @param {function} callback Function called after each calculation.
     */
    *_tableGenerator(index, callback) {
        if (!this.primes || typeof this.primes !== 'object') {
            throw new Error("Primes not available to work with!")
        }

        for (let i = 0; i < this.primes.length; i++) {
            const result = this.primes[index] * this.primes[i]
            callback(i, index, result)
            yield result
        }
    }
}