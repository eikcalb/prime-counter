import React from 'react';
import logo from './logo.svg';
import './App.css';

const ContextType = {
  WEBASSEMBLY: 0b001,
  JAVASCRIPT: 0b010,
  WEBWORKER: 0B100
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

  state = {
    // user JavaScript engine by default for computation.
    engine: ContextType.JAVASCRIPT
  }

  componentDidMount() {

  }

  handleLogic() {
    switch (this.state.engine) {
      case ContextType.JAVASCRIPT:

        break;
      case ContextType.WEBASSEMBLY:
        break;
      case ContextType.WEBWORKER:
        break;

      default:
        throw new Error("Dunno how you got here JS. Please report bug!!!!!")
    }
  }

  setContextType(type) {
    this.setState({ engine: type })
  }


  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    );
  }
}

export default App;
