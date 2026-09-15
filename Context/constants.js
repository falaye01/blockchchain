import crowdFunding from "./CrowdFunding.json";

// Configured contract address (auto-updated on deployment)
export const CrowdFundingAddress =
  process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS ||
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const CrowdFundingABI = crowdFunding.abi;
