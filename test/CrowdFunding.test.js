const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Contract", function () {
  let CrowdFunding, crowdFunding, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy();
    await crowdFunding.deployed();
  });

  describe("Deployment", function () {
    it("Should start with 0 campaigns", async function () {
      expect(await crowdFunding.numberOfCampaigns()).to.equal(0);
      const campaigns = await crowdFunding.getCampaigns();
      expect(campaigns.length).to.equal(0);
    });
  });

  describe("Create Campaign", function () {
    it("Should create a campaign successfully and emit event", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const futureDeadline = block.timestamp + 3600; // 1 hour later
      const target = ethers.utils.parseEther("5");

      await expect(
        crowdFunding.connect(owner).createCampaign(
          owner.address,
          "Clean Energy Tech",
          "Decentralized solar grid project",
          target,
          futureDeadline
        )
      )
        .to.emit(crowdFunding, "CampaignCreated")
        .withArgs(0, owner.address, "Clean Energy Tech", target, futureDeadline);

      expect(await crowdFunding.numberOfCampaigns()).to.equal(1);

      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.owner).to.equal(owner.address);
      expect(campaign.title).to.equal("Clean Energy Tech");
      expect(campaign.description).to.equal("Decentralized solar grid project");
      expect(campaign.target).to.equal(target);
      expect(campaign.deadline).to.equal(futureDeadline);
      expect(campaign.amountCollected).to.equal(0);
    });

    it("Should fail if deadline is not in the future", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const pastDeadline = block.timestamp - 100;
      const target = ethers.utils.parseEther("1");

      await expect(
        crowdFunding.createCampaign(
          owner.address,
          "Past Campaign",
          "Description",
          target,
          pastDeadline
        )
      ).to.be.revertedWith("Deadline must be in the future.");
    });

    it("Should fail if target amount is zero", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const futureDeadline = block.timestamp + 3600;

      await expect(
        crowdFunding.createCampaign(
          owner.address,
          "Zero Target",
          "Description",
          0,
          futureDeadline
        )
      ).to.be.revertedWith("Target amount must be greater than zero.");
    });
  });

  describe("Donate to Campaign", function () {
    let futureDeadline, target;

    beforeEach(async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      futureDeadline = block.timestamp + 3600;
      target = ethers.utils.parseEther("10");

      await crowdFunding.connect(owner).createCampaign(
        owner.address,
        "AI Research",
        "Autonomous AI research fund",
        target,
        futureDeadline
      );
    });

    it("Should accept donation, forward funds to owner, and update records", async function () {
      const donationAmount = ethers.utils.parseEther("1.5");
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await crowdFunding.connect(addr1).donateToCampaign(0, {
        value: donationAmount,
      });

      await expect(tx)
        .to.emit(crowdFunding, "DonationReceived")
        .withArgs(0, addr1.address, donationAmount, donationAmount);

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(donationAmount);

      const [donators, donations] = await crowdFunding.getDonators(0);
      expect(donators.length).to.equal(1);
      expect(donators[0]).to.equal(addr1.address);
      expect(donations[0]).to.equal(donationAmount);

      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.amountCollected).to.equal(donationAmount);
    });

    it("Should track multiple donations correctly", async function () {
      const don1 = ethers.utils.parseEther("1");
      const don2 = ethers.utils.parseEther("2");

      await crowdFunding.connect(addr1).donateToCampaign(0, { value: don1 });
      await crowdFunding.connect(addr2).donateToCampaign(0, { value: don2 });

      const [donators, donations] = await crowdFunding.getDonators(0);
      expect(donators.length).to.equal(2);
      expect(donators[0]).to.equal(addr1.address);
      expect(donators[1]).to.equal(addr2.address);
      expect(donations[0]).to.equal(don1);
      expect(donations[1]).to.equal(don2);

      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.amountCollected).to.equal(don1.add(don2));
    });

    it("Should revert if donating 0 Ether", async function () {
      await expect(
        crowdFunding.connect(addr1).donateToCampaign(0, { value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than zero.");
    });

    it("Should revert if donating to a non-existent campaign", async function () {
      await expect(
        crowdFunding.connect(addr1).donateToCampaign(99, {
          value: ethers.utils.parseEther("1"),
        })
      ).to.be.revertedWith("Campaign does not exist.");
    });
  });

  describe("Campaign Queries", function () {
    it("Should return all created campaigns", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const deadline = block.timestamp + 5000;

      await crowdFunding.createCampaign(owner.address, "C1", "D1", ethers.utils.parseEther("1"), deadline);
      await crowdFunding.createCampaign(addr1.address, "C2", "D2", ethers.utils.parseEther("2"), deadline);

      const all = await crowdFunding.getCampaigns();
      expect(all.length).to.equal(2);
      expect(all[0].title).to.equal("C1");
      expect(all[1].title).to.equal("C2");
    });
  });
});
