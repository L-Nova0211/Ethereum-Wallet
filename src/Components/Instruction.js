import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

export default class Instruction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    }
  }

  onOpenModal = () => {
    this.setState({open: true});
  };

  onCloseModal = () => {
    this.setState({open: false});
  };

  render() {
    const open = this.state.open;

    return (
      <div>
        <div className="container mb-3 text-right">
          <button className="btn btn-success" onClick={this.onOpenModal}>Show Instruction</button>
        </div>

        <Modal open={open} onClose={this.onCloseModal} center>
          <div className="react-modal-content">
            <p>This is a simple web wallet for Ethereum, built with Node JS and React JS. The wallet connects to Ropsten test network via Infura's service. This application is for learning purpose, no security policies is applied, private key is shown as plain text and it is sent across network without any encryption. <span className="warning">DO NOT USE THIS WALLET IN PRODUCTION OR USE IT WITH YOUR ETHEREUM WALLET FROM MAIN NETWORK</span> where you store your real ETH.</p>
            <p><strong>How To Use:</strong></p>
            <ul>
              <li>Create a new account. You can use your own account by entering its address, private key and clicking Update Account button.</li>
              <li>Get some test ETH by using <a href="https://faucet.ropsten.be/" target="_blank" rel="noopener noreferrer">Ropsten Faucet</a>. If you use <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a>, you can import your new account into MetaMask with private key and request test ETH via <a href="https://faucet.metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask's Faucet</a>.</li>
              <li>After you have ETH, you can try to send your ETH to a different account on Ropsten network. Check to see your balance and transaction list updated.</li>
            </ul>
            <p><strong>Ensure your address, private key start with "0x".</strong></p>
          </div>
        </Modal>
      </div>
    )
  }
}
