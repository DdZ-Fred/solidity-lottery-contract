module.exports = {
  accounts: {
    amount: 10, // Number of unlocked accounts
    ether: 100, // Initial balance of unlocked accounts (in ether)
  },
  contracts: {
    // Contract abstraction to use: 'truffle' for @truffle/contract or 'web3' for web3-eth-contract
    // Defines the type of contract to be returned by:
    // - contract.fromArtifact
    // - contract.formABI returns
    type: 'web3',
    defaultGas: 6e6, // Maximum gas for contract calls (when unspecified)

    // Options available since v0.1.2
    defaultGasPrice: 20e9, // Gas price for contract calls (when unspecified)
    artifactsDir: 'build/contracts', // Directory where contract artifacts are stored
  },
  node: { // Options passed directly to Ganache client
    gasLimit: 8e6, // Maximum gas per block
    gasPrice: 20e9, // Sets the default gas price for transactions if not otherwise specified.
  },
};
