import crowdFunding from "./CrowdFunding.json";

// Configured contract address (auto-updated on deployment)
export const CrowdFundingAddress =
  process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS ||
  "0x055C69EebA9ecf9CBb0676b36721370C8C51034b";

export const CrowdFundingABI = crowdFunding.abi;
