// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract VendingMachine {
    /* Errors */
    error VendingMachine__OverStock(string message);
    error VendingMachine__TransferFailed();
    error VendingMachine__InvalidSnack(string invalidSnack);
    /* State Variables */
    // use address(this).balance to find the contract's balance
    uint256 public constant INITIAL_QUANTITY = 20;
    uint256 contractBalance = address(this).balance;

    address private immutable i_owner;

    string[] private snackNames;

    struct Snacks {
        uint256 quantity;
        uint256 price;
    }
    // tracks snacks in the inventory
    mapping(string => Snacks) public inventory;
    // tracks balances of each caller that interacts with the contract
    mapping(address => uint256) public balances;
    /* Events */
    event Purchased(
        string msg,
        string snackPurchased,
        uint256 qtyPurchased,
        uint256 snackPrice
    );
    event WithdrawFunds(address ownerAccount, uint256 withdrawBalance);
    /*  Modifier */
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not contract owner");
        _;
    }

    constructor() payable {
        i_owner = payable(msg.sender);
        inventory["chips"] = Snacks(INITIAL_QUANTITY, 0.001 ether);
        snackNames.push("chips");
        inventory["drinks"] = Snacks(INITIAL_QUANTITY, 0.002 ether);
        snackNames.push("drinks");
        inventory["cookies"] = Snacks(INITIAL_QUANTITY, 0.001 ether);
        snackNames.push("cookies");
    }

    // receive function to handle ether being sent
    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    // Function that takes in ether payment in exchange for specific snack
    function purchaseSnack(
        string memory _snack,
        uint256 _quantity,
        uint256 _snackPrice
    ) external payable {
        Snacks storage snack = inventory[_snack];
        // _snackPrice = snack.price; // Retrieve the price based on the snack name
        require(
            _snackPrice == (snack.price * _quantity),
            "Invalid snack price"
        ); // Verify that the purchase price equals snack price multiplied by the quantity
        require(snack.price > 0 ether, "Invalid snack selected"); // Verify that the snack price exists
        require(
            msg.value >= _snackPrice,
            "Declined! Insufficient payment amount."
        ); // Verify that the payment is sufficient
        require(_quantity > 0, "Choose quantity to purchase");
        require(snack.quantity >= _quantity, "We've sold out of this item!"); // Verify the quantity of snacks in the vending machine
        if (
            keccak256(bytes(_snack)) != keccak256(bytes(snackNames[0])) &&
            keccak256(bytes(_snack)) != keccak256(bytes(snackNames[1])) &&
            keccak256(bytes(_snack)) != keccak256(bytes(snackNames[2]))
        ) {
            revert VendingMachine__InvalidSnack("Invalid snack selected");
        }

        snack.quantity -= _quantity;

        balances[msg.sender] += _snackPrice; // accounts for the amount spent from customer
        contractBalance += snack.price; // accounts for revenue earned by vending machine

        emit Purchased(
            "Thank you for your purchase of ",
            _snack,
            _quantity,
            _snackPrice
        );
        // console.log("line 95", _snack, snack.quantity, snack.price);
    }

    // Function to withdraw funds
    function withdraw() external onlyOwner {
        // address ownerOfContract = msg.sender;
        uint256 _balance = address(this).balance;
        payable(i_owner).transfer(_balance);

        emit WithdrawFunds(i_owner, _balance);
    }

    // Function to restock the inventory
    // only the owner should be able to call this function
    function restock() public onlyOwner {
        // Check and restock each snack individually
        restockSnack("chips");
        restockSnack("drinks");
        restockSnack("cookies");
    }

    function restockSnack(string memory snackName) private {
        Snacks storage snack = inventory[snackName];
        // Checks if the restock quantity is greater than or equal to the needed quantity
        uint256 restockQuantity = INITIAL_QUANTITY - snack.quantity;

        // Check whether the current snack quantity is less than the fully stocked quantity
        if (snack.quantity < INITIAL_QUANTITY) {
            snack.quantity += restockQuantity;
        } else {
            revert VendingMachine__OverStock("No need to restock");
        }
    }

    // Function to check the balance of the vending machine
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the snack information in inventory
    function getSnack(string memory _snack)
        external
        view
        returns (uint256, uint256)
    {
        Snacks storage snack = inventory[_snack];
        return (snack.quantity, snack.price);
    }
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
