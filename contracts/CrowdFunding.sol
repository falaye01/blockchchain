// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string title,
        uint256 target,
        uint256 deadline
    );

    event DonationReceived(
        uint256 indexed id,
        address indexed donor,
        uint256 amount,
        uint256 totalCollected
    );

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future.");
        require(_target > 0, "Target amount must be greater than zero.");
        require(bytes(_title).length > 0, "Title cannot be empty.");

        // If _owner is address(0), default to msg.sender
        address campaignOwner = _owner == address(0) ? msg.sender : _owner;

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = campaignOwner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        emit CampaignCreated(
            numberOfCampaigns,
            campaignOwner,
            _title,
            _target,
            _deadline
        );

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        uint256 amount = msg.value;
        require(amount > 0, "Donation amount must be greater than zero.");

        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.deadline, "Campaign deadline has passed.");

        // Update state before external call (Checks-Effects-Interactions)
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        emit DonationReceived(_id, msg.sender, amount, campaign.amountCollected);

        // Transfer funds directly to the campaign owner
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to send Ether to campaign owner.");
    }

    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaign(uint256 _id)
        public
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 target,
            uint256 deadline,
            uint256 amountCollected,
            address[] memory donators,
            uint256[] memory donations
        )
    {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        Campaign storage c = campaigns[_id];
        return (
            c.owner,
            c.title,
            c.description,
            c.target,
            c.deadline,
            c.amountCollected,
            c.donators,
            c.donations
        );
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}
