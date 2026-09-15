import React, { useState } from "react";

const Card = ({
  title,
  subtitle,
  allCampaign,
  setOpenModel,
  setDonate,
  address,
  onOpenCreateModal,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format remaining days
  const formatDaysLeft = (deadlineSec) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const diffSec = deadlineSec - nowSec;
    if (diffSec <= 0) return { text: "Expired", isExpired: true };
    const days = Math.floor(diffSec / (3600 * 24));
    const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
    if (days > 0) return { text: `${days}d ${hours}h left`, isExpired: false };
    const minutes = Math.floor((diffSec % 3600) / 60);
    return { text: `${hours}h ${minutes}m left`, isExpired: false };
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 self-start sm:self-auto">
          {allCampaign.length} {allCampaign.length === 1 ? "Campaign" : "Campaigns"} Found
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCampaign.length === 0 ? (
          <div className="col-span-full glass-panel rounded-3xl p-12 text-center border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4">
              ✨
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No Campaigns Found
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              There are currently no campaigns matching your filter. Be the pioneer and launch the very first one!
            </p>
            {onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-lg"
              >
                Launch a Campaign
              </button>
            )}
          </div>
        ) : (
          allCampaign.map((campaign) => {
            const isOwner =
              address &&
              campaign?.owner &&
              address.toLowerCase() === campaign.owner.toLowerCase();

            const timeLeft = formatDaysLeft(campaign.deadline);
            const percentageNum = Math.min(100, Math.max(0, parseFloat(campaign.percentage) || 0));
            const isGoalReached = parseFloat(campaign.amountCollected) >= parseFloat(campaign.target);

            return (
              <div
                key={campaign.pId}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/10 hover:border-brand-500/40 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Card Header: Creator & Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Creator Pill */}
                    <button
                      onClick={() => copyToClipboard(campaign.owner, campaign.pId)}
                      title="Click to copy creator address"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 transition-colors border border-white/5"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span>{formatAddress(campaign.owner)}</span>
                      {copiedId === campaign.pId && (
                        <span className="text-[10px] text-emerald-400 font-sans font-bold">
                          Copied!
                        </span>
                      )}
                    </button>

                    {/* Status Pill */}
                    {isGoalReached ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                        Goal Reached 🎯
                      </span>
                    ) : timeLeft.isExpired ? (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                        Ended
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                        {timeLeft.text}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mb-2 line-clamp-1">
                    {campaign.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-xs line-clamp-3 mb-5 leading-relaxed min-h-[3.25rem]">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-400">Funded</span>
                      <span className="text-brand-300">{campaign.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-btn transition-all duration-500"
                        style={{ width: `${percentageNum}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Target & Raised Stats */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Raised
                      </p>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        {parseFloat(campaign.amountCollected).toFixed(3)} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Target Goal
                      </p>
                      <p className="text-sm font-extrabold text-gray-300 mt-0.5">
                        {parseFloat(campaign.target).toFixed(3)} ETH
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 px-6 border-t border-white/5 bg-black/20 flex items-center gap-3">
                  {isOwner ? (
                    <div className="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold text-center">
                      👤 Your Campaign
                    </div>
                  ) : timeLeft.isExpired ? (
                    <button
                      onClick={() => {
                        setDonate(campaign);
                        setOpenModel(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold transition-colors"
                    >
                      View Donors ({campaign.donators?.length || 0})
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDonate(campaign);
                        setOpenModel(true);
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white gradient-btn shadow-md hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Back this Project</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Card;
