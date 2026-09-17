const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await deployer.getBalance();

  console.log(`\n========================================`);
  console.log(`Deploying CrowdFunding Protocol`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Deployer Balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
  console.log(`========================================\n`);

  if (balance.eq(0)) {
    console.error(`❌ Error: Deployer account (${deployer.address}) has 0 ETH!`);
    console.error(`Please fund this address with free Sepolia test ETH at:`);
    console.error(`👉 https://cloud.google.com/application/web3/faucet/ethereum/sepolia\n`);
    process.exitCode = 1;
    return;
  }

  console.log("Submitting deployment transaction to blockchain...");
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.deployed();

  const deployedAddress = crowdFunding.address;
  console.log(`\n✅ CrowdFunding successfully deployed to: ${deployedAddress}\n`);

  // Copy latest ABI to Context/CrowdFunding.json
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json"
  );
  const contextAbiPath = path.join(__dirname, "../Context/CrowdFunding.json");

  if (fs.existsSync(artifactPath)) {
    const artifactData = fs.readFileSync(artifactPath, "utf8");
    fs.writeFileSync(contextAbiPath, artifactData, "utf8");
    console.log("Updated Context/CrowdFunding.json with latest contract ABI.");
  }

  // Update Context/constants.js
  const constantsPath = path.join(__dirname, "../Context/constants.js");
  const constantsContent = `import crowdFunding from "./CrowdFunding.json";

// Configured contract address (auto-updated on deployment)
export const CrowdFundingAddress =
  process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS ||
  "${deployedAddress}";

export const CrowdFundingABI = crowdFunding.abi;
`;
  fs.writeFileSync(constantsPath, constantsContent, "utf8");
  console.log(`Updated Context/constants.js with address: ${deployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
