import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Account from './Components/Account';
import Transactions from './Components/Transactions';
import Send from './Components/Send';
import Balance from './Components/Balance';
import Instruction from './Components/Instruction';
import Message from './Components/Message';

library.add(faArrowUp, faArrowDown);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: {
        address: '',
        publicKey: '',
        privateKey: ''
      },
      balance: '',
      message: ''
    }
  }

  onUpdateAccount = (account) => {
    this.setState({
      account: account
    });
  }

  onUpdateMessage = (message) => {
    this.setState({
      message: message
    });
  }

  render() {
    return (
      <div className="app">
        <Instruction />
        <Message message={this.state.message} />
        <div className="container">
          <div className="row">
            <div className="col-md">
              <Account account={this.state.account} onUpdateAccount={this.onUpdateAccount} />
              <Transactions address={this.state.account.address} onUpdateMessage={this.onUpdateMessage} />
            </div>
            <div className="col-md">
              <Balance address={this.state.account.address} onUpdateMessage={this.onUpdateMessage} />
              <Send account={this.state.account} onUpdateMessage={this.onUpdateMessage} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
