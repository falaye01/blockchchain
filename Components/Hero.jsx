import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

const Hero = ({ onOpenCreateModal, stats }) => {
  const { currentAccount, connectWallet, createCampaign, isLoading } =
    useContext(CrowdFundingContext);

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  // Calculate min deadline (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleInlineCreate = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      await connectWallet();
      return;
    }

    const success = await createCampaign(campaign);
    if (success) {
      setCampaign({ title: "", description: "", amount: "", deadline: "" });
    }
  };

  const platformStats = [
    {
      label: "Total Raised",
      value: `${stats?.totalRaised || "0.00"} ETH`,
      sub: "Directly to creators",
      icon: "💎",
    },
    {
      label: "Live Campaigns",
      value: stats?.totalCampaigns || "0",
      sub: "Active on blockchain",
      icon: "🚀",
    },
    {
      label: "Total Contributions",
      value: stats?.totalDonationsCount || "0",
      sub: "From global backers",
      icon: "🤝",
    },
    {
      label: "Smart Contract",
      value: "100% P2P",
      sub: "Zero intermediary fee",
      icon: "⚡",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
              <span>Next-Gen Web3 Crowdfunding Protocol</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Fund the Future with <br className="hidden sm:inline" />
              <span className="text-gradient">Decentralized Power</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empower innovators, open-source builders, and creative initiatives. 
              Raise funds directly from a global pool of backers with instant P2P payouts 
              and zero custody risk.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenCreateModal}
                className="px-7 py-3.5 rounded-xl text-sm font-bold text-white gradient-btn shadow-xl shadow-brand-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <span>Start a Campaign</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="#campaigns-section"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
              >
                <span>Explore Projects</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Key Features Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <span className="text-brand-400 font-bold">✓</span>
                <span className="text-xs text-gray-400">Zero Platform Cut</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-400 font-bold">✓</span>
                <span className="text-xs text-gray-400">Instant Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-400 font-bold">✓</span>
                <span className="text-xs text-gray-400">Immutable Ledger</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Launch Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                Fast Track
              </div>

              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Create a Campaign</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Fill in project essentials to deploy instantly on-chain.
                </p>
              </div>

              <form onSubmit={handleInlineCreate} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clean Water Solar Initiative"
                    value={campaign.title}
                    onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Brief description of the initiative..."
                    value={campaign.description}
                    onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Target (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      required
                      placeholder="e.g. 5.0"
                      value={campaign.amount}
                      onChange={(e) => setCampaign({ ...campaign, amount: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateStr}
                      value={campaign.deadline}
                      onChange={(e) => setCampaign({ ...campaign, deadline: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-xs font-bold text-white gradient-btn mt-2 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Submitting to Blockchain...</span>
                    </>
                  ) : currentAccount ? (
                    "Launch Campaign"
                  ) : (
                    "Connect Wallet & Launch"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {platformStats.map((st, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                {st.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400">{st.label}</p>
                <h4 className="text-xl font-extrabold text-white mt-0.5 truncate">
                  {st.value}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{st.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
