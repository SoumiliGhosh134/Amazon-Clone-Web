let web3;
let marketplaceContract, reputationContract;

const marketplaceAddress = "<DEPLOYED_MARKETPLACE_ADDRESS>";
const reputationAddress = "<DEPLOYED_REPUTATION_ADDRESS>";

const marketplaceABI = [/* Add Marketplace ABI here */];
const reputationABI = [/* Add Reputation ABI here */];

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);
        reputationContract = new web3.eth.Contract(reputationABI, reputationAddress);
        loadProducts();
    } else {
        alert("Please install MetaMask!");
    }
}

async function createProduct() {
    const name = document.getElementById('productName').value;
    const price = web3.utils.toWei(document.getElementById('productPrice').value, 'ether');
    const accounts = await web3.eth.getAccounts();
    await marketplaceContract.methods.createProduct(name, price).send({ from: accounts[0] });
    loadProducts();
}

async function purchaseProduct() {
    const productId = document.getElementById('productId').value;
    const product = await marketplaceContract.methods.products(productId).call();
    const accounts = await web3.eth.getAccounts();
    await marketplaceContract.methods.purchaseProduct(productId).send({
        from: accounts[0],
        value: product.price
    });
    loadProducts();
}

async function submitReview() {
    const user = document.getElementById('reviewUser').value;
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;
    const accounts = await web3.eth.getAccounts();
    await reputationContract.methods.submitReview(user, rating, comment).send({ from: accounts[0] });
}

async function loadProducts() {
    const productCount = await marketplaceContract.methods.productCount().call();
    let productList = '';
    for (let i = 1; i <= productCount; i++) {
        const product = await marketplaceContract.methods.products(i).call();
        if (!product.purchased) {
            productList += `<div>
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Price:</strong> ${web3.utils.fromWei(product.price, 'ether')} ETH</p>
            </div>`;
        }
    }
    document.getElementById('products').innerHTML = productList;
}

window.onload = init;
