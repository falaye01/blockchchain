const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.deployed();

  const deployedAddress = crowdFunding.address;
  console.log(`CrowdFunding deployed to: ${deployedAddress}`);

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
