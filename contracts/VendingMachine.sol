// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract VendingMachine {
    // State Variables
    // use address(this).balance to find the contract's balance
    address private immutable i_owner;
    
    struct Snacks {
        uint256 quantity;
        uint256 price;
    }
    mapping(string => Snacks) public inventory;
    // tracks balances of each caller that interacts with the contract
    mapping(address => uint256) public balances;
    // Modifier
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not contract owner");
        _;
    }

    constructor() payable {
        i_owner = msg.sender;
        inventory["chips"] = Snacks(20, 0.001 ether);
        inventory["drinks"] = Snacks(20, 0.002 ether);
        inventory["cookies"] = Snacks(20, 0.001 ether);
    }

    // Function that takes in ether payment in exchange for specific snack
    function purchaseSnack(
        string calldata _snack,
        uint256 _quantity,
    ) public payable {
        Snacks storage snack = inventory[_snack]
        uint256 snackPrice = snack.price; // Retrieve the price based on the snack name
        
        require(snackPrice > 0, "Invalid snack selected"); // Verify that the snack price exists
        require(msg.value >= snackPrice, "Declined! Insufficient payment amount."); // Verify that the payment is sufficient
        
        require(snack.quantity  >= _quantity, "We've sold out of this item!"); // Verify the quantity of snacks in the vending machine
        snack.quantity -= _quantity;
        
        balances[msg.sender] += snackPrice; // accounts for the amount spent from customer
        address(this).balance += snack.price; // accounts for revenue earned by vending machine
    }

    // Function to check the balance of the vending machine
    function getBalance() public view returns (uint256) {
        // may have to add contractBalance = address(this.balance)
        return address(this).balance;
    }

    // Function to restock the inventory
    function restock() private {}

    // Function to withdraw funds
    function withdraw() public onlyOwner {}
}

// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions
