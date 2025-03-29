// Ensure you have Web3.js imported in your HTML file
// <script src="https://cdn.jsdelivr.net/npm/web3@4.0.0/dist/web3.min.js"></script>

// Connect to MetaMask or Infura
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);
            console.log("Connected to MetaMask!");
        } catch (error) {
            console.error("User denied wallet connection:", error);
        }
    } else {
        console.error("MetaMask not detected! Please install it.");
    }
}

// Deployed contract addresses
const DEPLOYED_MARKETPLACE_ADDRESS = "0xYourMarketplaceAddressHere";   // Replace with your Marketplace contract address
const DEPLOYED_REPUTATION_ADDRESS = "0xYourReputationAddressHere";      // Replace with your Reputation contract address

// Contract ABI (Add your own ABI here)
const MARKETPLACE_ABI = [
    // Example ABI methods
    {
        "constant": true,
        "inputs": [],
        "name": "getProductCount",
        "outputs": [{ "name": "", "type": "uint256" }],
        "type": "function"
    }
];

const REPUTATION_ABI = [
    // Example ABI methods
    {
        "constant": true,
        "inputs": [],
        "name": "getReputationScore",
        "outputs": [{ "name": "", "type": "uint256" }],
        "type": "function"
    }
];

// Initialize contracts
let marketplaceContract;
let reputationContract;

// Initialize Web3 and contracts
async function initContracts() {
    await connectWallet();

    const web3 = window.web3;

    marketplaceContract = new web3.eth.Contract(MARKETPLACE_ABI, DEPLOYED_MARKETPLACE_ADDRESS);
    reputationContract = new web3.eth.Contract(REPUTATION_ABI, DEPLOYED_REPUTATION_ADDRESS);

    console.log("Contracts initialized!");
}

// Fetch data from the contracts
async function fetchContractData() {
    try {
        const productCount = await marketplaceContract.methods.getProductCount().call();
        const reputationScore = await reputationContract.methods.getReputationScore().call();

        console.log(`Product Count: ${productCount}`);
        console.log(`Reputation Score: ${reputationScore}`);

        // Display contract data on the HTML page
        document.getElementById("marketplaceData").innerText = `Product Count: ${productCount}`;
        document.getElementById("reputationData").innerText = `Reputation Score: ${reputationScore}`;
    } catch (error) {
        console.error("Error fetching contract data:", error);
    }
}

// Load the contracts and display data
window.addEventListener("load", async () => {
    await initContracts();
    await fetchContractData();
});
