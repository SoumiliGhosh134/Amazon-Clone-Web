// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Reputation {
    struct Review {
        address reviewer;
        uint rating;
        string comment;
    }

    mapping(address => Review[]) public reviews;

    function addReview(address _seller, uint _rating, string memory _comment) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        reviews[_seller].push(Review(msg.sender, _rating, _comment));
    }

    function getReviews(address _seller) public view returns (Review[] memory) {
        return reviews[_seller];
    }
}
