const {
  accounts,
  contract,
  web3,
  provider
} = require('@openzeppelin/test-environment');
const { bytecode } = require('../build/contracts/Lottery.json');

const web3LotteryContract = contract.fromArtifact('Lottery');

describe('Lottery', () => {
  const [deployer, player1, player2, player3] = accounts;
  let lottery = null;

  beforeEach(async () => {
    lottery = await web3LotteryContract
      .deploy({
        data: bytecode,
        arguments: [],
      })
      .send({
        from: deployer,
        gas: 1_000_000,
        gasPrice: '2',
      });
  });

  it('deploys a contract', () => {
    expect(accounts.length).toEqual(10);
    expect(lottery.options.address).toBeTruthy();
  });

  it('initializes `manager` with the contract deployer address', async () => {
    const manager = await lottery.methods.manager().call();
    expect(manager).toEqual(deployer);
  });

  it('allows an account to enter the lottery', async () => {
    await lottery.methods.enter().send({
      from: player1,
      value: web3.utils.toWei('0.02', 'ether'),
    });
    const players = await lottery.methods.getPlayers().call();
    expect(players[0]).toEqual(player1);
    expect(players.length).toEqual(1);
  });

  it('allows multiple accounts to enter the lottery', async () => {
    await lottery.methods.enter().send({
      from: player1,
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: player2,
      value: web3.utils.toWei('0.02', 'ether'),
    });
    const players = await lottery.methods.getPlayers().call();
    expect(players[0]).toEqual(player1);
    expect(players[1]).toEqual(player2);
    expect(players.length).toEqual(2);
  });

  it('requires a user to send at least 1-million-wei to enter the lottery', async () => {
    const enterLotteryWithLessThan1MillionWei = () => lottery
      .methods
      .enter()
      .send({
        from: player1,
        value: 100,
      });
    await expect(enterLotteryWithLessThan1MillionWei())
      .rejects
      .toThrowError('The minimum amount is 1000000 wei.');
  });

  it('forbids the manager to enter the lottery', async () => {
    const enterLotteryAsManager = () => lottery
      .methods
      .enter()
      .send({
        from: deployer,
        value: 1_000_000,
      });
    await expect(enterLotteryAsManager())
      .rejects
      .toThrowError('The manager cannot participate to the lottery.');
  });

  it('prevents a random user from picking a winner', async () => {
    const pickWinnerAsRandomUser = () => lottery
      .methods
      .pickWinner()
      .send({
        from: player1,
      });
    await expect(pickWinnerAsRandomUser())
      .rejects
      .toThrowError('Only the manager can pick a winner.');
  });

  it('prevents manager from picking a winner if less than 3 players', async () => {
    await lottery.methods.enter().send({
      from: player1,
      value: 1_000_000,
    });
    await lottery.methods.enter().send({
      from: player2,
      value: 1_000_000,
    });
    const players = await lottery.methods.getPlayers().call();
    expect(players.length).toEqual(2);

    const pickWinnerAmongLessThan3Players = () => lottery
      .methods
      .pickWinner()
      .send({
        from: deployer,
      });

    await expect(pickWinnerAmongLessThan3Players)
      .rejects
      .toThrowError('Not enough players, minimum is 3.');
  });

  it('authorizes manager to pick a winner if at least 3 players', async () => {
    await lottery.methods.enter().send({
      from: player1,
      value: 3_000_000,
    });
    await lottery.methods.enter().send({
      from: player2,
      value: 2_000_000,
    });
    await lottery.methods.enter().send({
      from: player3,
      value: 2_000_000,
    });

    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    expect(lotteryBalance).toEqual('7000000');
    const players = await lottery.methods.getPlayers().call();
    expect(players.length).toEqual(3);

    await lottery.methods.pickWinner().send({
      from: deployer,
    });

    const lotteryBalanceAfterWinnerPicking = await web3.eth.getBalance(lottery.options.address);
    expect(lotteryBalanceAfterWinnerPicking).toEqual('0');

    const playersAfterWinnerPicking = await lottery.methods.getPlayers().call();
    expect(playersAfterWinnerPicking.length).toEqual(0);
  });
});
