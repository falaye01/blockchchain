import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { PROJECT_CATEGORIES } from "../Context/ipfs";

const Hero = ({ onOpenCreateModal, stats }) => {
  const { currentAccount, connectWallet, createCampaign, isLoading } =
    useContext(CrowdFundingContext);

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    category: "Tech & AI",
  });

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
      setCampaign({
        title: "",
        description: "",
        amount: "",
        deadline: "",
        category: "Tech & AI",
      });
    }
  };

  const platformStats = [
    {
      label: "Total Raised",
      value: `${stats?.totalRaised || "0.00"} ETH`,
      sub: "Sent directly to creators",
    },
    {
      label: "Active Campaigns",
      value: stats?.totalCampaigns || "0",
      sub: "Published on chain",
    },
    {
      label: "Contributions",
      value: stats?.totalDonationsCount || "0",
      sub: "Direct backer payments",
    },
    {
      label: "Protocol Fee",
      value: "0%",
      sub: "100% direct payouts",
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
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              <span>Open Peer-to-Peer Crowdfunding</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bring meaningful projects <br className="hidden sm:inline" />
              <span className="text-gradient">to life together</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Raise funds directly from supporters worldwide. Every contribution is transferred
              instantly to the project creator via smart contracts, with full transparency and no intermediary cuts.
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
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
              >
                <span>Explore Projects</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white">Direct Payouts</span>
                <p className="text-[11px] text-gray-400">Funds go straight to creators</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white">Zero Cut</span>
                <p className="text-[11px] text-gray-400">No platform commissions</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white">Transparent</span>
                <p className="text-[11px] text-gray-400">Auditable on Ethereum</p>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Launch Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 relative">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Start a Campaign</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Share your goal, set a target, and begin receiving contributions.
                </p>
              </div>

              <form onSubmit={handleInlineCreate} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What are you building?"
                    value={campaign.title}
                    onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={campaign.category}
                    onChange={(e) => setCampaign({ ...campaign, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl glass-input text-xs"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Target (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      required
                      placeholder="e.g. 2.5"
                      value={campaign.amount}
                      onChange={(e) => setCampaign({ ...campaign, amount: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
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

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Tell supporters what you plan to accomplish..."
                    value={campaign.description}
                    onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-xs font-semibold text-white gradient-btn mt-2 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Creating campaign...</span>
                    </>
                  ) : currentAccount ? (
                    "Publish Campaign"
                  ) : (
                    "Connect Wallet & Publish"
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
              className="glass-card rounded-2xl p-5 border border-white/5 space-y-1"
            >
              <p className="text-xs font-medium text-gray-400">{st.label}</p>
              <h4 className="text-2xl font-bold text-white tracking-tight">
                {st.value}
              </h4>
              <p className="text-[11px] text-gray-500">{st.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
