// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CrowdFunding {
    struct Update {
        uint256 timestamp;
        string title;
        string content;
    }

    struct Comment {
        address commenter;
        uint256 timestamp;
        string message;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        string category;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Update[]) private campaignUpdates;
    mapping(uint256 => Comment[]) private campaignComments;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string title,
        uint256 target,
        uint256 deadline,
        string category,
        string image
    );

    event DonationReceived(
        uint256 indexed id,
        address indexed donor,
        uint256 amount,
        uint256 totalCollected
    );

    event UpdatePosted(
        uint256 indexed id,
        uint256 indexed updateIndex,
        string title,
        uint256 timestamp
    );

    event CommentAdded(
        uint256 indexed id,
        address indexed commenter,
        string message,
        uint256 timestamp
    );

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        string memory _category
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future.");
        require(_target > 0, "Target amount must be greater than zero.");
        require(bytes(_title).length > 0, "Title cannot be empty.");

        address campaignOwner = _owner == address(0) ? msg.sender : _owner;
        string memory categoryVal = bytes(_category).length == 0 ? "General" : _category;

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = campaignOwner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.category = categoryVal;

        emit CampaignCreated(
            numberOfCampaigns,
            campaignOwner,
            _title,
            _target,
            _deadline,
            categoryVal,
            _image
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

        // Checks-Effects-Interactions
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        emit DonationReceived(_id, msg.sender, amount, campaign.amountCollected);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to send Ether to campaign owner.");
    }

    function postUpdate(
        uint256 _id,
        string memory _title,
        string memory _content
    ) public {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        require(msg.sender == campaigns[_id].owner, "Only the campaign creator can post updates.");
        require(bytes(_title).length > 0, "Update title cannot be empty.");

        Update memory newUpdate = Update({
            timestamp: block.timestamp,
            title: _title,
            content: _content
        });

        campaignUpdates[_id].push(newUpdate);
        emit UpdatePosted(_id, campaignUpdates[_id].length - 1, _title, block.timestamp);
    }

    function addComment(uint256 _id, string memory _message) public {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        require(bytes(_message).length > 0, "Comment cannot be empty.");

        Comment memory newComment = Comment({
            commenter: msg.sender,
            timestamp: block.timestamp,
            message: _message
        });

        campaignComments[_id].push(newComment);
        emit CommentAdded(_id, msg.sender, _message, block.timestamp);
    }

    function getUpdates(uint256 _id) public view returns (Update[] memory) {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        return campaignUpdates[_id];
    }

    function getComments(uint256 _id) public view returns (Comment[] memory) {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        return campaignComments[_id];
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
            string memory image,
            string memory category,
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
            c.image,
            c.category,
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
