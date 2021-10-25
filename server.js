require('dotenv').config();

const etherscanAPIKey = process.env.ETHERSCAN_API_KEY;
const infuraAPIKey = process.env.INFURA_API_KEY;
const port = process.env.REACT_APP_BACKEND_PORT;

const express = require('express');
const axios = require('axios');
const unit = require('ethjs-unit');
const cors = require('cors');
const moment = require('moment');
const ethCrypto = require('eth-crypto');
const Web3 = require('web3');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('build'));

app.get('/api/getBalance', function(req, res) {
  let address = req.query.address;

  if (address) {
    let url = 'https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + etherscanAPIKey;

    axios.get(url).then(function(response) {
      if (response.status == 200 && response.data.result) {
        let balance = unit.fromWei(response.data.result, 'ether');
        res.send({success: true, message: '', data: balance});
      } else {
        res.send({success: false, message: 'Unknown response from Etherscan', data: null});
      }
    })
  } else {
    res.send({success: false, message: 'Invalid address', data: null});
  }
});

app.get('/api/getTransactions', function(req, res) {
  let address = req.query.address;

  if (address) {
    let url = 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&sort=desc&address=' + address + '&apikey=' + etherscanAPIKey;

    axios.get(url).then(function(response) {
      if (response.status == 200 && response.data.result) {
        let transactions = new Array;

        if (response.data.result.length > 0) {
          for (let i = 0; i < response.data.result.length; i++) {
            let t = response.data.result[i];
            var add = true;

            // Sometimes we have duplicated transactions.
            for (var j = 0; j < transactions.length; j++) {
              if (transactions[j].hash === t.hash) {
                add = false;
                break;
              }
            }

            if (!add)
              continue;

            let created = moment.unix(t.timeStamp).format('MMMM DD, YYYY hh:mm');
            let amount = unit.fromWei(t.value, 'ether');
            let transactionType;
            let partner;

            if (t.from === address.toLowerCase()) {
              transactionType = 'send';
              partner = t.to;
            } else {
              transactionType = 'receive';
              partner = t.from;
            }

            let transaction = {
              hash: t.hash,
              type: transactionType,
              partner: partner,
              amount: amount,
              created: created
            };

            transactions.push(transaction);
          }
        }

        res.send({success: true, message: '', data: transactions});
      } else {
        res.send({success: false, message: 'Unknown response from Etherscan', data: null});
      }
    })
  } else {
    res.send({success: false, message: 'Invalid address', data: null});
  }
});

app.get('/api/createAccount', function(req, res) {
  const account = ethCrypto.createIdentity();

  res.send({success: true, message: '', data: account});
});

app.post('/api/send', function(req, res) {
  let senderAddress = req.body.senderAddress;
  let senderPrivateKey = req.body.senderPrivateKey;
  let recipientAddress = req.body.recipientAddress;
  let value = unit.toWei(req.body.amount, 'ether');
  let gasPrice = unit.toWei(req.body.gasPrice, 'gwei');
  let gasLimit = req.body.gasLimit;

  const web3 = new Web3('https://ropsten.infura.io/v3/' + infuraAPIKey);

  web3.eth.getTransactionCount(senderAddress, 'pending', function(err, result) {
    if (err) {
      res.send({success: false, message: err.toString(), data: null});
    } else {
      const rawTransaction = {
        from: senderAddress,
        to: recipientAddress,
        value: value,
        gasPrice: gasPrice,
        nonce: result,
        gasLimit: gasLimit
      };

      const signedTransaction = ethCrypto.signTransaction(
        rawTransaction,
        senderPrivateKey
      );

      web3.eth.sendSignedTransaction('0x' + signedTransaction, function(err, result) {
        if (err) {
          res.send({success: false, message: err.toString(), data: null});
        } else {
          res.send({success: true, message: 'Transaction was sent sucessfully. Transaction hash: ' + result + '.', data: null});
        }
      });
    }
  });
});

app.listen(port, () => console.log("Listening on port " + port + "..."));
