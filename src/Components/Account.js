import React, { Component } from 'react';
import axios from 'axios';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: props.account.address,
      publicKey: props.account.publicKey,
      privateKey: props.account.privateKey,
      isCreating: false
    }
  }

  updatePrivateKey = (e) => {
    this.setState({ privateKey: e.target.value })
  }

  updatePublicKey = (e) => {
    this.setState({ publicKey: e.target.value })
  }

  updateAddress = (e) => {
    this.setState({ address: e.target.value })
  }

  updateAccount =  () => {
    let account = {
      address: this.state.address,
      publicKey: this.state.publicKey,
      privateKey: this.state.privateKey
    };

    this.props.onUpdateAccount(account);
  }

  updateMessage =  (message) => {
    this.props.onUpdateMessage(message);
  }

  createAccount =  () => {
    let host = process.env.REACT_APP_BACKEND_HOST;
    let port = process.env.REACT_APP_BACKEND_PORT;
    let url = host + ':' + port + '/api/createAccount';

    let _this = this;

    this.setState({isCreating: true});

    axios.get(url).then(function(response) {
      if (response.data.success && response.data.data) {
        let account = response.data.data;
        _this.setState({
          address: account.address,
          publicKey: account.publicKey,
          privateKey: account.privateKey
        });

        _this.props.onUpdateAccount(account);
      }

      if (response.data.message) {
        _this.updateMessage(response.data.message);
      }

      _this.setState({isCreating: false});
    });
  }

  render() {
    let inputDisabledAttr;
    let buttonDisabledAttr;

    if (this.state.isCreating === false) {
      inputDisabledAttr = {};
      buttonDisabledAttr = '';
    } else {
      inputDisabledAttr =  {'disabled' : 'disabled'};
      buttonDisabledAttr = 'disabled';
    }

    return (
      <div className="accordion" id="accountAccordion">
        <div className="card">
          <div className="card-header" id="accountHeading">
            <h5 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#accountCollapse" aria-expanded="true" aria-controls="accountCollapse">
                Account
              </button>
            </h5>
          </div>

          <div id="accountCollapse" className="collapse show" aria-labelledby="accountHeading" data-parent="#accountAccordion">
            <div className="card-body">
              <div className="form-group">
                <button className="btn btn-primary" onClick={this.createAccount}>Create New Account</button>

                <p><small id="newAccountHelp" className="form-text text-muted">Backup your address and your keys before creating new account.</small></p>

                <label htmlFor="address">Address</label>

                <input
                  type="text"
                  className="form-control"
                  id="address"
                  aria-describedby="addressHelp"
                  onChange={this.updateAddress}
                  value={this.state.address}
                  {...inputDisabledAttr}
                />

                <small id="addressHelp" className="form-text text-muted">This is your address. Send ETH to this address.</small>
              </div>

              <div className="form-group">
                <label htmlFor="publicKey">Public Key</label>

                <input
                  type="text"
                  className="form-control"
                  id="publicKey"
                  onChange={this.updatePublicKey}
                  value={this.state.publicKey}
                  {...inputDisabledAttr}
                />
              </div>

              <div className="form-group">
                <label htmlFor="privateKey">Private Key</label>

                <input
                  type="text"
                  className="form-control"
                  id="privateKey"
                  aria-describedby="privateKeyHelp"
                  onChange={this.updatePrivateKey}
                  value={this.state.privateKey}
                  {...inputDisabledAttr}
                />

                <small id="privateKeyHelp" className="form-text text-muted">Use your private key to import this account to other wallets, for example MetaMask.</small>
              </div>

              <button className={`btn btn-primary ${buttonDisabledAttr}`} onClick={this.updateAccount}>Update Account</button>

              <small id="updateAccountHelp" className="form-text text-muted">Update account after you change address, private key or public key.</small>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
