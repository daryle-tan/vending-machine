// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract VendingMachine {
    // use address(this).balance to find the contract's balance
    address private immutable i_owner;

    struct Snacks {
        uint256 quantity;
        uint256 price;
    }
    mapping(string => Snacks) public inventory;

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not contract owner");
        _;
    }

    constructor(uint256 initialQuantity, uint256 initialPrice) payable {
        i_owner = msg.sender;
        inventory["chips"] = Snacks(initialQuantity, initialPrice);
        inventory["drinks"] = Snacks(initialQuantity, initialPrice);
        inventory["cookies"] = Snacks(initialQuantity, initialPrice);
    }

    // Function that takes in ether payment in exchange for specific snack
    function transaction(
        string calldata _snack,
        uint256 _quantity,
        uint256 _price
    ) public payable {
        require(msg.value >= .001 ether, "You must pay .001 for the snack");
        // inventory[_snack] = new Snacks();
        if (_snack == "chips") {
            inventory["chips"] = Snacks(_quantity--, _price);
        }
        if (_snack == "drinks") {
            inventory["drinks"] = Snacks(_quantity--, _price);
        }
        if (_snack == "cookies") {
            inventory["cookies"] = Snacks(_quantity--, _price);
        }
    }

    // Function to check the balance of the vending machine
    function getBalance() public view returns (uint256) {
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
