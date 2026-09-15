# CryptoFund — Decentralized Web3 Crowdfunding Protocol

A decentralized, trustless, and peer-to-peer crowdfunding platform built on Ethereum smart contracts. CryptoFund enables innovators and project creators to raise capital directly from a global pool of backers with instant P2P settlement and zero platform fees.

---

## ✨ Features

- **Direct P2P Settlement**: 100% of contributed funds are transferred directly to the campaign creator's wallet with zero intermediary fees.
- **Security & Integrity**: Smart contracts follow the Checks-Effects-Interactions pattern, emit indexed events, and enforce atomic transaction reverts on failed transfers.
- **Live Campaign Explorer**: Real-time search across titles, descriptions, and creator addresses with category filtering (*Explore All*, *🔥 Active*, *🎯 Goal Reached*, *👤 My Campaigns*).
- **Interactive Backing Experience**: Fast donation modal with preset ETH increments (`+0.01`, `+0.05`, `+0.1`, `+0.5`, `+1.0 ETH`), wallet balance validation, and live donor ledger.
- **Campaign Creation**: Intuitive launch form with input validations, minimum future date checking, and transaction lifecycle spinners.
- **Multi-Account Reactivity**: Automatically updates balances and UI state when switching accounts or networks in MetaMask.
- **Comprehensive Testing**: Automated Hardhat unit tests verifying deployment, campaign creation, donations, edge cases, and queries.

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.18`
- **Development & Testing Framework**: Hardhat, Ethers.js v5, Chai
- **Frontend Framework**: Next.js 13, React 18
- **Styling & Design System**: Tailwind CSS, Dark Glassmorphism, Vanilla CSS

---

## 📁 Project Structure

```text
Crowdfunding-defi/
├── contracts/               # Solidity Smart Contracts
│   └── CrowdFunding.sol     # Main Crowdfunding Contract
├── scripts/                 # Deployment scripts
│   └── deploy.js            # Hardhat deployment script
├── test/                    # Hardhat Automated Unit Tests
│   └── CrowdFunding.test.js # Unit test suite
├── Context/                 # React Context & Web3 State
│   ├── CrowdFunding.js      # Contract interaction & provider logic
│   └── constants.js         # Contract ABI & address configuration
├── Components/              # UI Components
│   ├── NavBar.jsx           # Header with wallet connection & balance pill
│   ├── Hero.jsx             # Hero section with live aggregate stats
│   ├── Card.jsx             # Campaign cards with progress bars & countdowns
│   ├── PopUp.jsx            # Donation modal & donor history
│   ├── CreateCampaignModal.jsx # Dedicated campaign creation modal
│   ├── NotificationToast.jsx   # Real-time transaction feedback toast
│   └── Footer.jsx           # Ecosystem footer
├── pages/                   # Next.js Pages
│   ├── _app.js              # Global provider & layout wrapper
│   └── index.js             # Main dashboard page
└── styles/
    └── globals.css          # Design system & glassmorphism tokens
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MetaMask](https://metamask.io/) browser extension

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/falaye01/blockchchain.git
   cd blockchchain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

### Running Locally

1. **Start the local Hardhat blockchain node**:
   ```bash
   npx hardhat node
   ```

2. **Deploy the smart contract to the local node** (in a separate terminal):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start the Next.js frontend**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🦊 MetaMask Localhost Setup

1. Open **MetaMask** and select the **Localhost 8545** network (Chain ID `31337`).
2. Import one of the pre-funded test private keys provided in the `npx hardhat node` terminal output:
   ```text
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. Connect your wallet on [http://localhost:3000](http://localhost:3000) to start creating and backing campaigns.

---

## 🧪 Running Automated Tests

Run the smart contract test suite with:

```bash
npx hardhat test
```

---

## 📜 Smart Contract Interface

| Function | Type | Description |
| :--- | :--- | :--- |
| `createCampaign(address, string, string, uint256, uint256)` | `public` | Creates a new crowdfunding campaign with target amount and deadline. |
| `donateToCampaign(uint256)` | `public payable` | Contributes ETH to a campaign and transfers funds immediately to the owner. |
| `getCampaigns()` | `public view` | Returns all created campaigns. |
| `getDonators(uint256)` | `public view` | Returns the list of donators and donation amounts for a specific campaign. |
| `getCampaign(uint256)` | `public view` | Returns details of a specific campaign by ID. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
