// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.sender != manager, "The manager cannot participate to the lottery.");
        // TODO: Check if user isn't already in the list
        require(msg.value >= 1000000 wei, "The minimum amount is 1000000 wei.");
        
        players.push(msg.sender);
    }
    
    function pickWinner() public managerOnly {
        // require(msg.sender == manager,"Only the manager can pick a winner.");
        require(players.length > 2, "Not enough players, minimum is 3.");
        
        uint winnerIndex = random() % players.length;
        players[winnerIndex].transfer(address(this).balance);
        players = new address payable[](0);
    }
    modifier managerOnly {
        require(msg.sender == manager, "Only the manager can pick a winner.");
        _;
    }
    
    function random() private view returns (uint) {
        // abi.encodePacked: encode given arguments into bytes
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
}

