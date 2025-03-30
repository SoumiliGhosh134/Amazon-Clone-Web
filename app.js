// Ensure you have Web3.js imported in your HTML file
// <script src="https://cdn.jsdelivr.net/npm/web3@4.0.0/dist/web3.min.js"></script>

// Connect to MetaMask or Infura
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);
            console.log("✅ Connected to MetaMask!");
        } catch (error) {
            console.error("❌ User denied wallet connection:", error);
        }
    } else {
        console.error("❌ MetaMask not detected! Please install it.");
    }
}

// Deployed contract addresses (Replace with valid addresses)
const DEPLOYED_MARKETPLACE_ADDRESS = "0x3af24c6c7b1e7e139df5835c352046033d47e1e"; // Replace with valid address
const DEPLOYED_REPUTATION_ADDRESS = "0xdb9ff4ac1e32b4d492ecbb8358af48ee239b0355"; // Replace with valid address

// Contract ABI (Add your real ABI here)
const MARKETPLACE_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" }
        ],
        "name": "createProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "seller", "type": "address" }
        ],
        "name": "ProductCreated",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "purchaseProduct",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "productCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const REPUTATION_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_rating",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_comment",
                "type": "string"
            }
        ],
        "name": "addReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
            }
        ],
        "name": "getReviews",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "reviewer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rating",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "comment",
                        "type": "string"
                    }
                ],
                "internalType": "struct Reputation.Review[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reviews",
        "outputs": [
            {
                "internalType": "address",
                "name": "reviewer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "rating",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "comment",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReputationScore",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Initialize contracts
let marketplaceContract;
let reputationContract;

// Initialize Web3 and contracts
async function initContracts() {
    await connectWallet();

    if (!window.web3) {
        console.error("❌ Web3 is not initialized!");
        return;
    }

    const web3 = window.web3;

    // Connect to smart contracts
    marketplaceContract = new web3.eth.Contract(MARKETPLACE_ABI, DEPLOYED_MARKETPLACE_ADDRESS);
    reputationContract = new web3.eth.Contract(REPUTATION_ABI, DEPLOYED_REPUTATION_ADDRESS);

    console.log("✅ Contracts initialized!");
}

// Fetch data from the contracts
async function fetchContractData() {
    try {
        if (!marketplaceContract || !reputationContract) {
            console.error("❌ Contracts not initialized!");
            return;
        }

        const productCount = await marketplaceContract.methods.productCount().call();
        const reputationScore = await reputationContract.methods.getReputationScore().call();

        console.log(`📦 Product Count: ${productCount}`);
        console.log(`⭐ Reputation Score: ${reputationScore}`);

        // Display contract data on the HTML page
        document.getElementById("marketplaceData").innerText = `📦 Product Count: ${productCount}`;
        document.getElementById("reputationData").innerText = `⭐ Reputation Score: ${reputationScore}`;
    } catch (error) {
        console.error("❌ Error fetching contract data:", error);
    }
}

// Load the contracts and display data
window.addEventListener("load", async () => {
    await initContracts();
    await fetchContractData();
});
