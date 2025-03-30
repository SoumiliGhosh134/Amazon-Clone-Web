// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        address payable seller;
        bool sold;
    }

    uint public productCount = 0;
    mapping(uint => Product) public products;

    event ProductCreated(uint id, string name, uint price, address seller);
    event ProductPurchased(uint id, address buyer);

    function createProduct(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        productCount++;
        products[productCount] = Product(productCount, _name, _description, _price, payable(msg.sender), false);
        emit ProductCreated(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint _id) public payable {
        Product storage product = products[_id];
        require(_id > 0 && _id <= productCount, "Invalid product ID");
        require(msg.value == product.price, "Incorrect payment amount");
        require(!product.sold, "Product already sold");

        product.seller.transfer(msg.value);
        product.sold = true;

        emit ProductPurchased(_id, msg.sender);
    }
}
