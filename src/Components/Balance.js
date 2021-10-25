import React, { Component } from 'react';
import axios from 'axios';

export default class Balance extends Component {
  constructor(props) {
    super(props);

    this.seconds = process.env.REACT_APP_UPDATE_INTERVAL;

    this.state = {
      address: props.address,
      balance: 0,
      seconds: this.seconds,
      isUpdating: false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.setState({address: this.props.address});

      var _this = this;

      setTimeout(function() {
        _this.updateBalance();
      }, 500);
    }
  }

  updateMessage =  (message) => {
    this.props.onUpdateMessage(message);
  }

  updateBalance() {
    this.stopCounting();

    this.setState({
      isUpdating: true
    });

    let host = process.env.REACT_APP_BACKEND_HOST;
    let port = process.env.REACT_APP_BACKEND_PORT;
    let url = host + ':' + port + '/api/getBalance?address=' + this.state.address;

    let _this = this;

    axios.get(url).then(function(response) {
      if (response.data.success && response.data.data) {
        _this.setState({
          balance: response.data.data,
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
      this.updateBalance();
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
      message = <p className="text-info">Update balance in { this.state.seconds } second(s).</p>;
    } else if (this.state.address !== '') {
      message = <p className="text-info">Updating balance...</p>;
    } else {
      message = '';
    }

    return (
      <div className="accordion" id="balanceAccordion">
        <div className="card">
          <div className="card-header" id="balanceHeading">
            <h5 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#balanceCollapse" aria-expanded="true" aria-controls="balanceCollapse">
                Balance
              </button>
            </h5>
          </div>

          <div id="balanceCollapse" className="collapse show" aria-labelledby="balanceHeading" data-parent="#balanceAccordion">
            <div className="card-body">
              <p>{this.state.balance} ETH</p>
              {message}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
