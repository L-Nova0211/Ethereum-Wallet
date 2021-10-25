import React, { Component } from 'react';
import axios from 'axios';

export default class Send extends Component {
  constructor(props) {
    super(props);

    this.state = {
      senderAddress: props.account.address,
      senderPrivateKey: props.account.privateKey,
      recipientAddress: '',
      amount: 0.01,
      gasLimit: 21000,
      gasPrice: 1,
      isSending: false
    }
  }

  updateRecipientAddress = (e) => {
    this.setState({ recipientAddress: e.target.value })
  }

  updateAmount = (e) => {
    this.setState({ amount: e.target.value })
  }

  updateGasPrice = (e) => {
    this.setState({ gasPrice: e.target.value })
  }

  updateGasLimit = (e) => {
    this.setState({ gasLimit: e.target.value })
  }

  componentDidUpdate(prevProps) {
    if (this.props.account.address !== prevProps.account.address) {
      this.setState({senderAddress: this.props.account.address});
    }

    if (this.props.account.privateKey !== prevProps.account.privateKey) {
      this.setState({senderPrivateKey: this.props.account.privateKey});
    }
  }

  updateMessage =  (message) => {
    this.props.onUpdateMessage(message);
  }

  send = () => {
    let host = process.env.REACT_APP_BACKEND_HOST;
    let port = process.env.REACT_APP_BACKEND_PORT;
    let url = host + ':' + port + '/api/send';

    let senderAddress = this.state.senderAddress;
    let senderPrivateKey = this.state.senderPrivateKey;
    let recipientAddress = this.state.recipientAddress;

    if (senderAddress === '') {
      this.updateMessage('Your address is empty');
      return;
    }

    if (senderPrivateKey === '') {
      this.updateMessage('Your private key is empty');
      return;
    }

    if (recipientAddress === '') {
      this.updateMessage("Recipient's address is empty");
      return;
    }

    var _this = this;

    this.setState({isSending: true});

    axios.post(url, {
      senderAddress: senderAddress,
      senderPrivateKey: senderPrivateKey,
      recipientAddress: recipientAddress,
      amount: this.state.amount,
      gasLimit: this.state.gasLimit,
      gasPrice: this.state.gasPrice
    }).then(function (response) {
      if (response.data.message) {
        _this.updateMessage(response.data.message);
      }

      _this.setState({isSending: false});
    }).catch(function (error) {
      if (error.message) {
        _this.updateMessage(error.message);
      }

      _this.setState({isSending: false});
    });
  }

  render() {
    let inputDisabledAttr;
    let buttonDisabledAttr;

    if (this.state.isSending === false) {
      inputDisabledAttr = {};
      buttonDisabledAttr = '';
    } else {
      inputDisabledAttr =  {'disabled' : 'disabled'};
      buttonDisabledAttr = 'disabled';
    }

    return (
      <div className="accordion" id="sendAccordion">
        <div className="card">
          <div className="card-header" id="sendHeading">
            <h5 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#sendCollapse" aria-expanded="true" aria-controls="sendCollapse">
                Send
              </button>
            </h5>
          </div>

          <div id="sendCollapse" className="collapse show" aria-labelledby="sendHeading" data-parent="#sendAccordion">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="to">To</label>

                <input
                  type="text"
                  className="form-control"
                  id="to"
                  aria-describedby="toHelp"
                  placeholder="Receiver's address"
                  onChange={this.updateRecipientAddress}
                  value={this.state.recipientAddress}
                  {...inputDisabledAttr}
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount</label>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="amount"
                    placeholder="Amount of ETH"
                    onChange={this.updateAmount}
                    value={this.state.amount}
                    {...inputDisabledAttr}
                  />

                  <div className="input-group-append">
                    <span className="input-group-text">ETH</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gasPrice">Gas Price</label>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="gasPrice"
                    placeholder="Gas Price"
                    onChange={this.updateGasPrice}
                    value={this.state.gasPrice}
                    {...inputDisabledAttr}
                  />

                  <div className="input-group-append">
                    <span className="input-group-text">Gwei</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gasLimit">Gas Limit</label>

                <input
                  type="text"
                  className="form-control"
                  id="gasLimit"
                  placeholder="Gas Limit"
                  onChange={this.updateGasLimit}
                  value={this.state.gasLimit}
                  {...inputDisabledAttr}
                />
              </div>

              <button className={`btn btn-primary ${buttonDisabledAttr}`} onClick={this.send}>Send</button>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
