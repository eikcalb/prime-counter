import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Table } from './components/table';
import { JSContext, GOContext } from './lib/context';
import { withToastManager } from 'react-toast-notifications';

const ContextType = {
  WEBASSEMBLY: 1,
  JAVASCRIPT: 2,
  WEBWORKER: 3
}

/**
 * Main entry for application.
 * 
 * Broser feature detection is handled here.
 * The logic within may be pushed into a `React.Context` object if required.
 * 
 * ... not today!
 */
class App extends React.PureComponent {
  /**
   * Cache for holding already created context objects when switching context types.
   */
  contextCache = {
    JS: null,
    GO: null
  }

  state = {
    // user JavaScript engine by default for computation.
    engine: ContextType.JAVASCRIPT,
    context: new JSContext(),
    primes: [],
    status: "Prime Counter generates a specified amount of prime numbers and calculates the product, displaying results in a table. You can select between the JavaScript or WebAssembly engine."
  }

  async componentDidMount() {
    this.setState({ primes: await this.state.context.getPrimes() })
  }

  // checkContext(type, expected) {
  //   if (type & expected !== 0) {
  //     return true
  //   }
  //   return false
  // }

  existsInCache(type) {
    switch (type) {
      case ContextType.JAVASCRIPT:
        if (this.contextCache.JS) {
          this.contextCache.JS.run()
          return this.contextCache.JS
        }
        break;
      case ContextType.WEBASSEMBLY:
        if (this.contextCache.GO) {
          this.contextCache.GO.run()
          return this.contextCache.GO
        }
        break;
      default:
        return false
    }
  }

  getOldOrMakeNew(type) {
    switch (type) {
      case ContextType.JAVASCRIPT:
        return this.existsInCache(ContextType.JAVASCRIPT) || new JSContext()
      case ContextType.WEBASSEMBLY:
        return this.existsInCache(ContextType.WEBASSEMBLY) || new GOContext()
      case ContextType.WEBWORKER:
        return this.existsInCache(ContextType.WEBWORKER)

      default:
        throw new Error("Dunno how you got here JS. Please report bug!!!!!")
    }
  }

  setContextType(type) {
    const old = { type: this.state.engine, context: this.state.context }
    let saveToCache = true
    if (old.type === type) {
      saveToCache = false
      console.log('...resetting context...')
    }

    switch (old.type) {
      case ContextType.JAVASCRIPT:
        this.state.context.stop()
        if (saveToCache) this.contextCache.JS = this.state.context
        break;
      case ContextType.WEBASSEMBLY:
        this.state.context.stop()
        if (saveToCache) this.contextCache.GO = this.state.context
        break;
      case ContextType.WEBWORKER:
        throw new Error("Not yet implemented!")
      default:
        throw new Error("Dunno how you got here JS. Please report bug!!!!!")
    }

    try {
      const cached = this.getOldOrMakeNew(type)
      this.setState({ engine: type, context: cached })
    } catch (e) {
      console.error(e)
      this.setState({ status: e.message })
      // recover from failure by using last known good configuration.
      this.setContextType(old.type)
    }
  }


  render() {
    const { toastManager } = this.props


    return (
      <div className="App" >
        <header>
          <select className="select" value={this.state.engine} onChange={e => {
            toastManager.add(`Updating context engine...`, {
              appearance: 'info',
              autoDismiss: true
            })
            this.setContextType(parseInt(e.target.value))
          }}>
            <option value={ContextType.JAVASCRIPT}>JAVASCRIPT</option>
            <option value={ContextType.WEBASSEMBLY}>WEBASSEMBLY</option>
          </select>

          <form className='textbox' onSubmit={async e => {
            e.preventDefault()
            e.stopPropagation()

            this.setState({ primes: await this.state.context.setPrimeCount(parseInt(document.getElementById('primeCountInput').value, 10)) }, () => toastManager.add('Updated Prime Count!', {
              appearance: 'success',
              autoDismiss: true
            }))
          }}>
            <input id='primeCountInput' type='number' placeholder="Set Prime number count..." />
          </form>
        </header>
        <main>

          <div className='table-container'>
            <Table headers={this.state.primes || []} />
          </div>

          <button className="button" onClick={() => {
            const startId = toastManager.add("Inflating table...", { appearance: 'info' })
            this.state.context.inflateTable().then(() => {
              toastManager.remove(startId)
              toastManager.add('Finished updating table!', { appearance: 'success', autoDismiss: true })
            })
          }}>Inflate Table</button>

          <div>
            <p id='status'>{this.state.status}</p>
          </div>
        </main>
        <address><p>&copy; eikcalb, {(new Date()).getFullYear()}</p></address>
      </div >
    );
  }
}

export default withToastManager(App);
