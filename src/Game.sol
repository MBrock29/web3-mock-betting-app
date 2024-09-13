// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Game {
    // State Variables
    uint256 public randomNumber;
    uint256 public payoutAmount;
    uint256 private balance;
    uint256 private winnings;
    uint256 private rand;
    uint256 private depositAmount;
    bool private win;

    struct Player {
        address walletAddress;
        uint256 balance;
        bool hasDeposited;
    }

    mapping(address => Player) public players;
    address public owner;

    // Events
    event Deposit(address indexed userAddress, uint256 weiAmount, uint256 contractBalance);
    event Withdraw(address indexed userAddress, uint256 weiAmount, uint256 contractBalance);
    event OwnerWithdrawal(address indexed owner, uint256 weiAmount, uint256 contractBalance);
    event BetResult(address indexed player, uint256 amountWon);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // Constructor
    constructor() payable {
        balance = 0;
        owner = msg.sender;
    }

    // Public and external functions

    /// @notice Allows a player to deposit ETH into the contract.
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        players[msg.sender].balance += msg.value;
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /// @notice Allows a player to withdraw their balance.
    /// @param balanceAmount The amount the player wishes to withdraw.
    function withdraw(uint256 balanceAmount) public payable {
        require(balanceAmount <= players[msg.sender].balance, "Insufficient balance");
        payable(msg.sender).transfer(balanceAmount);
        players[msg.sender].balance -= balanceAmount;
        emit Withdraw(msg.sender, balanceAmount, address(this).balance);
    }

    /// @notice Allows the contract owner to withdraw all funds from the contract.
    function withdrawOwner() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds available in the contract");
        payable(owner).transfer(contractBalance);
        emit OwnerWithdrawal(owner, contractBalance, address(this).balance);
    }

    /// @notice Allows a player to place a bet on the home team.
    function betHomeTeam(uint256 amount, uint256 odds, uint256 perc) public {
        rand = uint256(keccak256(abi.encodePacked(block.timestamp)));
        randomNumber = (rand % 100) + 1;
        if (randomNumber <= perc) {
            winnings = ((amount * odds) / 100) - amount;
            players[msg.sender].balance += winnings;
            emit BetResult(msg.sender, winnings);
            win = true;
        } else {
            require(players[msg.sender].balance >= amount, "Insufficient balance");
            players[msg.sender].balance -= amount;
            win = false;
        }
    }

    /// @notice Allows a player to place a bet on a draw.
    function betDraw(uint256 amount, uint256 odds, uint256 perc) public {
        rand = uint256(keccak256(abi.encodePacked(block.timestamp)));
        randomNumber = (rand % 100) + 1;
        if (randomNumber <= perc) {
            winnings = ((amount * odds) / 100) - amount;
            players[msg.sender].balance += winnings;
            win = true;
        } else {
            players[msg.sender].balance -= amount;
            win = false;
        }
    }

    /// @notice Allows a player to place a bet on the away team.
    function betAwayTeam(uint256 amount, uint256 odds, uint256 perc) public {
        rand = uint256(keccak256(abi.encodePacked(block.timestamp)));
        randomNumber = (rand % 100) + 1;
        if (randomNumber <= perc) {
            winnings = ((amount * odds) / 100) - amount;
            players[msg.sender].balance += winnings;
            win = true;
        } else {
            players[msg.sender].balance -= amount;
            win = false;
        }
    }

    // View and pure functions

    /// @notice Returns the balance of a specific player.
    function getBalance(address userAddress) public view returns (uint256) {
        return players[userAddress].balance;
    }

    /// @notice Returns the contract's balance.
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the random number used in the latest bet.
    function getRandomNumber() public view returns (uint256) {
        return randomNumber;
    }

    /// @notice Returns the result of the most recent bet (win or lose).
    function getResult() public view returns (bool) {
        return win;
    }

    /// @notice Returns the details of a specific player.
    function getIndividualPlayer(address addr) public view returns (Player memory) {
        return players[addr];
    }
}
