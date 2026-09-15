import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import {
  CampaignCreated,
  DonationReceived,
  UpdatePosted,
  CommentAdded,
} from "../generated/CrowdFunding/CrowdFunding";
import {
  Campaign,
  Donation,
  ProjectUpdate,
  Comment,
  Donor,
  ProtocolMetric,
} from "../generated/schema";

const WEI_FACTOR = BigDecimal.fromString("1000000000000000000");

function toEther(wei: BigInt): BigDecimal {
  return wei.toBigDecimal().div(WEI_FACTOR);
}

export function handleCampaignCreated(event: CampaignCreated): void {
  let campaignId = event.params.id.toString();
  let campaign = new Campaign(campaignId);

  campaign.pId = event.params.id;
  campaign.owner = event.params.owner;
  campaign.title = event.params.title;
  campaign.description = "";
  campaign.target = toEther(event.params.target);
  campaign.deadline = event.params.deadline;
  campaign.amountCollected = BigDecimal.fromString("0");
  campaign.category = event.params.category;
  campaign.image = event.params.image;
  campaign.createdAt = event.block.timestamp;
  campaign.isGoalReached = false;
  campaign.isExpired = false;

  campaign.save();

  // Update global metrics
  let metric = ProtocolMetric.load("GLOBAL");
  if (!metric) {
    metric = new ProtocolMetric("GLOBAL");
    metric.totalRaised = BigDecimal.fromString("0");
    metric.totalCampaigns = BigInt.fromI32(0);
    metric.totalDonations = BigInt.fromI32(0);
  }
  metric.totalCampaigns = metric.totalCampaigns.plus(BigInt.fromI32(1));
  metric.updatedAt = event.block.timestamp;
  metric.save();
}

export function handleDonationReceived(event: DonationReceived): void {
  let campaignId = event.params.id.toString();
  let campaign = Campaign.load(campaignId);

  let donationId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let donation = new Donation(donationId);

  donation.campaign = campaignId;
  donation.donor = event.params.donor;
  donation.amount = toEther(event.params.amount);
  donation.timestamp = event.block.timestamp;
  donation.txHash = event.transaction.hash;
  donation.save();

  if (campaign) {
    campaign.amountCollected = toEther(event.params.totalCollected);
    if (campaign.amountCollected.ge(campaign.target)) {
      campaign.isGoalReached = true;
    }
    campaign.save();
  }

  // Update Donor record
  let donorId = event.params.donor.toHex();
  let donor = Donor.load(donorId);
  if (!donor) {
    donor = new Donor(donorId);
    donor.address = event.params.donor;
    donor.totalDonated = BigDecimal.fromString("0");
    donor.donationsCount = BigInt.fromI32(0);
  }
  donor.totalDonated = donor.totalDonated.plus(toEther(event.params.amount));
  donor.donationsCount = donor.donationsCount.plus(BigInt.fromI32(1));
  donor.save();

  // Update global metrics
  let metric = ProtocolMetric.load("GLOBAL");
  if (metric) {
    metric.totalRaised = metric.totalRaised.plus(toEther(event.params.amount));
    metric.totalDonations = metric.totalDonations.plus(BigInt.fromI32(1));
    metric.updatedAt = event.block.timestamp;
    metric.save();
  }
}

export function handleUpdatePosted(event: UpdatePosted): void {
  let updateId = event.params.id.toString() + "-update-" + event.params.updateIndex.toString();
  let update = new ProjectUpdate(updateId);

  update.campaign = event.params.id.toString();
  update.title = event.params.title;
  update.content = "";
  update.timestamp = event.params.timestamp;
  update.save();
}

export function handleCommentAdded(event: CommentAdded): void {
  let commentId = event.params.id.toString() + "-comment-" + event.transaction.hash.toHex();
  let comment = new Comment(commentId);

  comment.campaign = event.params.id.toString();
  comment.commenter = event.params.commenter;
  comment.message = event.params.message;
  comment.timestamp = event.params.timestamp;
  comment.save();
}
