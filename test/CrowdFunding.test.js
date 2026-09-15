const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Protocol", function () {
  let CrowdFunding, crowdFunding, owner, backer1, backer2, otherAccount;

  beforeEach(async function () {
    [owner, backer1, backer2, otherAccount] = await ethers.getSigners();
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
    it("Should create a campaign with image and category", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const futureDeadline = block.timestamp + 86400; // 1 day
      const target = ethers.utils.parseEther("5");

      await expect(
        crowdFunding.connect(owner).createCampaign(
          owner.address,
          "Clean Energy Tech",
          "Decentralized solar grid project",
          target,
          futureDeadline,
          "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
          "Green Energy"
        )
      )
        .to.emit(crowdFunding, "CampaignCreated")
        .withArgs(
          0,
          owner.address,
          "Clean Energy Tech",
          target,
          futureDeadline,
          "Green Energy",
          "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
        );

      expect(await crowdFunding.numberOfCampaigns()).to.equal(1);

      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.owner).to.equal(owner.address);
      expect(campaign.title).to.equal("Clean Energy Tech");
      expect(campaign.image).to.equal("ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi");
      expect(campaign.category).to.equal("Green Energy");
    });
  });

  describe("Project Updates & Backer Discussions", function () {
    beforeEach(async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const futureDeadline = block.timestamp + 86400;

      await crowdFunding.connect(owner).createCampaign(
        owner.address,
        "Decentralized AI",
        "Open source AI models",
        ethers.utils.parseEther("10"),
        futureDeadline,
        "https://images.unsplash.com/photo-ai.jpg",
        "Tech & AI"
      );
    });

    it("Should allow the campaign owner to post project updates", async function () {
      await expect(
        crowdFunding.connect(owner).postUpdate(0, "Prototype Alpha Released", "We have completed the MVP testnet demo.")
      )
        .to.emit(crowdFunding, "UpdatePosted");

      const updates = await crowdFunding.getUpdates(0);
      expect(updates.length).to.equal(1);
      expect(updates[0].title).to.equal("Prototype Alpha Released");
      expect(updates[0].content).to.equal("We have completed the MVP testnet demo.");
    });

    it("Should reject update posting from non-owners", async function () {
      await expect(
        crowdFunding.connect(backer1).postUpdate(0, "Unauthorized update", "Content")
      ).to.be.revertedWith("Only the campaign creator can post updates.");
    });

    it("Should allow backers/users to add comments", async function () {
      await expect(
        crowdFunding.connect(backer1).addComment(0, "Excited for this project! Just contributed 1 ETH.")
      )
        .to.emit(crowdFunding, "CommentAdded")
        .withArgs(0, backer1.address, "Excited for this project! Just contributed 1 ETH.", (val) => val > 0);

      const comments = await crowdFunding.getComments(0);
      expect(comments.length).to.equal(1);
      expect(comments[0].commenter).to.equal(backer1.address);
      expect(comments[0].message).to.equal("Excited for this project! Just contributed 1 ETH.");
    });
  });

  describe("Donations & Direct Settlement", function () {
    it("Should accept donations and settle directly with creator", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const futureDeadline = block.timestamp + 3600;

      await crowdFunding.connect(owner).createCampaign(
        owner.address,
        "Medical Research",
        "Open cancer genomics",
        ethers.utils.parseEther("5"),
        futureDeadline,
        "",
        "Education & Research"
      );

      const donationAmount = ethers.utils.parseEther("2");
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      await crowdFunding.connect(backer1).donateToCampaign(0, { value: donationAmount });

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(donationAmount);

      const [donators, donations] = await crowdFunding.getDonators(0);
      expect(donators[0]).to.equal(backer1.address);
      expect(donations[0]).to.equal(donationAmount);
    });
  });
});
