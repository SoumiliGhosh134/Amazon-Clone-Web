// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    address public buyer;
    address payable public seller;
    address public arbiter;
    uint public amount;
    bool public isReleased = false;

    constructor(address _buyer, address payable _seller, address _arbiter) payable {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        amount = msg.value;
    }

    function releaseFunds() public {
        require(msg.sender == buyer || msg.sender == arbiter, "Only buyer or arbiter can release funds");
        require(!isReleased, "Funds already released");

        seller.transfer(amount);
        isReleased = true;
    }
}
