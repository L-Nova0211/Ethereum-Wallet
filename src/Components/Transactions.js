import React, { Component } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

export default class Transactions extends Component {
  constructor(props) {
    super(props);

    this.seconds = process.env.REACT_APP_UPDATE_INTERVAL;

    this.state = {
      address: props.address,
      seconds: this.seconds,
      isUpdating: false,
      transactions: []
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.setState({address: this.props.address});

      var _this = this;

      setTimeout(function() {
        _this.updateTransactions();
      }, 500);
    }
  }

  updateMessage =  (message) => {
    this.props.onUpdateMessage(message);
  }

  updateTransactions() {
    this.stopCounting();

    this.setState({
      isUpdating: true
    });

    let host = process.env.REACT_APP_BACKEND_HOST;
    let port = process.env.REACT_APP_BACKEND_PORT;
    let url = host + ':' + port + '/api/getTransactions?address=' + this.state.address;

    let _this = this;

    axios.get(url).then(function(response) {
      if (response.data.success && response.data.data) {
        _this.setState({
          transactions: response.data.data,
          isUpdating: false,
          seconds: _this.seconds
        });

        _this.startCounting();
      }

      if (response.data.message) {
        _this.updateMessage(response.data.message);
      }
    });
  }

  tick() {
    let currentSeconds = this.state.seconds;
    let seconds;

    if (currentSeconds > 1) {
      seconds = currentSeconds - 1;

      this.setState({
        seconds: seconds
      });
    } else {
      this.updateTransactions();
    }
  }

  startCounting() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  stopCounting() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    if (this.state.address !== '') {
      this.startCounting();
    }
  }

  componentWillUnmount() {
    this.stopCounting();
  }

  render() {
    let message;

    if (this.state.address !== '' && !this.state.isUpdating) {
      message = <p className="text-info">Update transactions in { this.state.seconds } second(s).</p>;
    } else if (this.state.address !== '') {
      message = <p className="text-info">Updating transactions...</p>;
    } else {
      message = '';
    }

    let transactions = this.state.transactions.map((t) =>
      <Transaction
        key={t.hash}
        hash={t.hash}
        type={t.type}
        partner={t.partner}
        amount={t.amount}
        created={t.created}></Transaction>
    );

    return (
      <div className="accordion" id="transactionAccordion">
        <div className="card">
          <div className="card-header" id="transactionHeading">
            <h5 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#transactionCollapse" aria-expanded="true" aria-controls="transactionCollapse">
                Transactions
              </button>
            </h5>
          </div>

          <div id="transactionCollapse" className="collapse show" aria-labelledby="transactionHeading" data-parent="#transactionAccordion">
            <div className="card-body">
              <ul>{transactions}</ul>
              {message}
            </div>
          </div>
        </div>
      </div>

    )
  }
}
