import crowdFunding from "./CrowdFunding.json";

// Default local Hardhat deployed address or configured address
// Can also be overridden via NEXT_PUBLIC_CROWDFUNDING_ADDRESS env variable
export const CrowdFundingAddress =
  process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CrowdFundingABI = crowdFunding.abi;
