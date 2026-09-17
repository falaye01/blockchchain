import crowdFunding from "./CrowdFunding.json";

// Configured contract address (auto-updated on deployment)
export const CrowdFundingAddress =
  process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CrowdFundingABI = crowdFunding.abi;
