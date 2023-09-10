// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract VendingMachine {
    /* Errors */
    error VendingMachine__OverStock(string message);
    error VendingMachine__TransferFailed();
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

    mapping(string => Snacks) public inventory;
    // tracks balances of each caller that interacts with the contract
    mapping(address => uint256) public balances;
    /* Events */
    event Purchased(
        string msg,
        uint256 qtyPurchased,
        string snackPurchased,
        uint256 snackPrice
    );
    event WithdrawFunds(address ownerAccount, uint256 withdrawBalance);
    /*  Modifier */
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not contract owner");
        _;
    }

    constructor() payable {
        i_owner = msg.sender;
        inventory["chips"] = Snacks(INITIAL_QUANTITY, 0.001 ether);
        inventory["drinks"] = Snacks(INITIAL_QUANTITY, 0.002 ether);
        inventory["cookies"] = Snacks(INITIAL_QUANTITY, 0.001 ether);
        snackNames.push("chips");
        snackNames.push("drinks");
        snackNames.push("cookies");
    }

    // receive function to handle ether being sent
    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    // Function that takes in ether payment in exchange for specific snack
    function purchaseSnack(
        string calldata _snack,
        uint256 _quantity,
        uint256 _snackPrice
    ) public payable {
        Snacks storage snack = inventory[_snack];
        _snackPrice = snack.price; // Retrieve the price based on the snack name

        require(_snackPrice > 0, "Invalid snack selected"); // Verify that the snack price exists
        require(
            msg.value >= _snackPrice,
            "Declined! Insufficient payment amount."
        ); // Verify that the payment is sufficient

        require(snack.quantity >= _quantity, "We've sold out of this item!"); // Verify the quantity of snacks in the vending machine
        snack.quantity -= _quantity;

        balances[msg.sender] += _snackPrice; // accounts for the amount spent from customer
        contractBalance += snack.price; // accounts for revenue earned by vending machine

        emit Purchased(
            "Thank you for your purchase of ",
            _quantity,
            _snack,
            _snackPrice
        );
    }

    // Function to withdraw funds
    function withdraw() external onlyOwner {
        // address ownerOfContract = msg.sender;
        uint256 _balance = address(this).balance;
        payable(i_owner).transfer(_balance);

        emit WithdrawFunds(i_owner, _balance);
    }

    // Function to restock the inventory
    // only the owner should be able to call this fn
    function restock() private onlyOwner {
        // update quantity of snacks
        for (uint256 i = 0; i < snackNames.length; i++) {
            string memory snackName = snackNames[i];
            Snacks storage snack = inventory[snackName];
            uint256 restockQuantity = INITIAL_QUANTITY - snack.quantity; // Checks if the restock quantity is greater than or equal to the needed quantity
            // checks whether the current snack quantity is less than the needed quantity
            if (snack.quantity < INITIAL_QUANTITY) {
                snack.quantity += restockQuantity;
            } else {
                revert VendingMachine__OverStock("No need to restock");
            }
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
