require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./build/contracts/Lottery.json');

/**
 * Allows us to access our own accounts
 * on the Rinkeby Test Network
 */
const provider = new HDWalletProvider(
  process.env.EXTERNAL_ACCOUNT_MNEMONIC,
  'https://rinkeby.infura.io/v3/3660f633ef7c4051aca006fd6eaf8429',
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account: ${accounts[0]}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({
      from: accounts[0],
      gas: 1_000_000,
    });

  console.log('Contract deployed to:', result.options.address);
};
deploy();
