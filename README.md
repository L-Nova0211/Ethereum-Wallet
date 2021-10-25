This is a simple Ethereum web wallet built with Node and React JS. This wallet is for learning purpose, do not use it in production or use it with your real Ethereum account.

The wallet connects to Ropsten test network via [Infura](https://infura.io/) and use [Etherscan](https://etherscan.io/) for getting balance and transactions, so you need to register on these services to get API keys.

1. Clone the repo.

2. Run `npm install`.

3. Copy `.env.sample` to `.env` and edit the environment variables to your values.

 * `ETHERSCAN_API_KEY`: your Etherscan API key
 * `INFURA_API_KEY`: your Infura API key
 * `REACT_APP_BACKEND_HOST`: domain or IP of server side app, for example http://localhost
 * `REACT_APP_BACKEND_PORT`: port of server side app, for example 3001
 * `PORT`: port of client side app, for example 3002
 * `REACT_APP_UPDATE_INTERVAL`: how often client side app updates balance and transactions

4. Start the server app with `node server.js`, run the client app with `yarn start`.
