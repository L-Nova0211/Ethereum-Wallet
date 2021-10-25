import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Transactions extends Component {
  render() {
    let icon;
    let amount;

    if (this.props.type === 'send') {
      icon = <FontAwesomeIcon icon="arrow-up" />;
      amount = <span>-{`${this.props.amount}`}</span>;
    } else {
      icon = <FontAwesomeIcon icon="arrow-down" />
      amount = <span>+{`${this.props.amount}`}</span>;
    }

    let link = <a href={`https://ropsten.etherscan.io/tx/${this.props.hash}`} target="_blank">{this.props.partner}</a>;

    return (
      <li>
        <div className="fa">{icon}</div>
        <div className={`transaction ${this.props.type}`}>
          <div className="address">{link}</div>
          <div className="amount">{amount} ETH</div>
          <div>{this.props.created}</div>
        </div>
      </li>
    );
  }
}
