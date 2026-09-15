import React, { useMemo, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { CrowdFundingAddress } from "../Context/constants";

const StatsAnalytics = ({ allCampaigns, onOpenCreateModal }) => {
  const { currentAccount } = useContext(CrowdFundingContext);

  const stats = useMemo(() => {
    const totalCampaigns = allCampaigns.length;
    const totalRaised = allCampaigns.reduce(
      (acc, c) => acc + (parseFloat(c.amountCollected) || 0),
      0
    );
    const totalTarget = allCampaigns.reduce(
      (acc, c) => acc + (parseFloat(c.target) || 0),
      0
    );
    const totalContributions = allCampaigns.reduce(
      (acc, c) => acc + (c.donators?.length || 0),
      0
    );
    const fundedCampaigns = allCampaigns.filter((c) => c.isGoalReached).length;
    const activeCampaigns = allCampaigns.filter((c) => !c.isExpired && !c.isGoalReached).length;
    const expiredCampaigns = allCampaigns.filter((c) => c.isExpired && !c.isGoalReached).length;

    const successRate =
      totalCampaigns > 0 ? ((fundedCampaigns / totalCampaigns) * 100).toFixed(1) : "0";

    const avgContribution =
      totalContributions > 0 ? (totalRaised / totalContributions).toFixed(4) : "0.00";

    // Top funded campaigns
    const topFunded = [...allCampaigns]
      .sort((a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected))
      .slice(0, 4);

    return {
      totalCampaigns,
      totalRaised: totalRaised.toFixed(3),
      totalTarget: totalTarget.toFixed(3),
      totalContributions,
      fundedCampaigns,
      activeCampaigns,
      expiredCampaigns,
      successRate,
      avgContribution,
      topFunded,
    };
  }, [allCampaigns]);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Platform Statistics & Analytics
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Real-time on-chain metrics across all deployed campaigns and contributions.
        </p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total ETH Raised
          </p>
          <h3 className="text-3xl font-extrabold text-white">
            {stats.totalRaised} <span className="text-sm text-brand-400">ETH</span>
          </h3>
          <p className="text-[11px] text-gray-500">
            Across {stats.totalContributions} total contributions
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Projects
          </p>
          <h3 className="text-3xl font-extrabold text-white">
            {stats.totalCampaigns}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="text-emerald-400">{stats.activeCampaigns} Active</span>
            <span>•</span>
            <span className="text-brand-300">{stats.fundedCampaigns} Funded</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Average Contribution
          </p>
          <h3 className="text-3xl font-extrabold text-white">
            {stats.avgContribution} <span className="text-sm text-brand-400">ETH</span>
          </h3>
          <p className="text-[11px] text-gray-500">
            Per backer transaction
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Funding Success Rate
          </p>
          <h3 className="text-3xl font-extrabold text-emerald-400">
            {stats.successRate}%
          </h3>
          <p className="text-[11px] text-gray-500">
            {stats.fundedCampaigns} of {stats.totalCampaigns} reached target goal
          </p>
        </div>
      </div>

      {/* Campaign Performance & Top Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Funded Campaigns */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">
            Leading Campaigns by Contributions
          </h3>
          {stats.topFunded.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No campaign data available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topFunded.map((c) => (
                <div
                  key={c.pId}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {c.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {c.description}
                    </p>
                    <span className="text-[10px] font-mono text-gray-500">
                      Creator: {formatAddress(c.owner)}
                    </span>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-sm font-extrabold text-white">
                      {parseFloat(c.amountCollected).toFixed(3)} / {parseFloat(c.target).toFixed(3)} ETH
                    </p>
                    <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden ml-auto">
                      <div
                        className="h-full rounded-full gradient-btn"
                        style={{
                          width: `${Math.min(
                            100,
                            (parseFloat(c.amountCollected) / (parseFloat(c.target) || 1)) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Protocol Details & Security Status */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white">
            Protocol Health
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Smart Contract</span>
              <span className="text-emerald-400 font-semibold">Active & Audited</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Intermediary Fee</span>
              <span className="text-white font-semibold">0.00%</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
              <span className="text-gray-400">Fund Settlement</span>
              <span className="text-white font-semibold">Instant On-Chain</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-gray-400 block">Deployed Contract Address</span>
              <span className="font-mono text-indigo-300 break-all text-[11px] block">
                {CrowdFundingAddress}
              </span>
            </div>
          </div>

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="w-full py-3 rounded-xl text-xs font-semibold text-white gradient-btn shadow-lg"
            >
              Start a New Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsAnalytics;
