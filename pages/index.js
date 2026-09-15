import React, { useEffect, useState, useContext, useMemo } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import {
  NavBar,
  Hero,
  Card,
  PopUp,
  Footer,
  CreateCampaignModal,
} from "../Components";

const Index = () => {
  const {
    getCampaigns,
    getUserCampaigns,
    donate,
    getDonations,
    currentAccount,
    refreshIndex,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Filters and Search State
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'my' | 'active' | 'funded'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'target_high' | 'target_low' | 'most_funded'
  const [loading, setLoading] = useState(true);

  // Fetch campaign data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData = await getCampaigns();
        let userData = [];
        if (currentAccount) {
          userData = allData.filter(
            (c) => c.owner.toLowerCase() === currentAccount.toLowerCase()
          );
        }
        if (isMounted) {
          setAllCampaigns(allData || []);
          setUserCampaigns(userData);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [getCampaigns, currentAccount, refreshIndex]);

  // Aggregate platform statistics
  const platformStats = useMemo(() => {
    const totalRaised = allCampaigns.reduce(
      (acc, c) => acc + (parseFloat(c.amountCollected) || 0),
      0
    );
    const totalDonationsCount = allCampaigns.reduce(
      (acc, c) => acc + (c.donators?.length || 0),
      0
    );

    return {
      totalRaised: totalRaised.toFixed(2),
      totalCampaigns: allCampaigns.length,
      totalDonationsCount,
    };
  }, [allCampaigns]);

  // Filtered and Sorted Campaigns
  const displayedCampaigns = useMemo(() => {
    let list = [...allCampaigns];

    // Filter by Tab
    if (activeTab === "my") {
      list = list.filter(
        (c) =>
          currentAccount &&
          c.owner.toLowerCase() === currentAccount.toLowerCase()
      );
    } else if (activeTab === "active") {
      list = list.filter((c) => !c.isExpired && !c.isGoalReached);
    } else if (activeTab === "funded") {
      list = list.filter((c) => c.isGoalReached);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.owner?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "newest") {
      list.sort((a, b) => b.pId - a.pId);
    } else if (sortBy === "target_high") {
      list.sort((a, b) => parseFloat(b.target) - parseFloat(a.target));
    } else if (sortBy === "target_low") {
      list.sort((a, b) => parseFloat(a.target) - parseFloat(b.target));
    } else if (sortBy === "most_funded") {
      list.sort(
        (a, b) =>
          parseFloat(b.amountCollected) - parseFloat(a.amountCollected)
      );
    }

    return list;
  }, [allCampaigns, activeTab, searchQuery, sortBy, currentAccount]);

  const activeCount = useMemo(
    () => allCampaigns.filter((c) => !c.isExpired && !c.isGoalReached).length,
    [allCampaigns]
  );
  const fundedCount = useMemo(
    () => allCampaigns.filter((c) => c.isGoalReached).length,
    [allCampaigns]
  );
  const myCount = useMemo(() => userCampaigns.length, [userCampaigns]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 bg-mesh selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <NavBar
        onOpenCreateModal={() => setOpenCreateModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero Section */}
      <Hero
        onOpenCreateModal={() => setOpenCreateModal(true)}
        stats={platformStats}
      />

      {/* Main Campaign Explorer */}
      <main id="campaigns-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar: Tabs, Search, Sort */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 border border-white/10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "all"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>Explore All</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {allCampaigns.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "active"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>🔥 Active</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("funded")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "funded"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>🎯 Goal Reached</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {fundedCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("my")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "my"
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span>👤 My Campaigns</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {myCount}
                </span>
              </button>
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-xl glass-input text-xs"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white p-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto h-10 px-3 rounded-xl glass-input text-xs font-semibold"
                >
                  <option value="newest" className="bg-gray-900 text-white">
                    Sort: Newest
                  </option>
                  <option value="most_funded" className="bg-gray-900 text-white">
                    Sort: Most Funded
                  </option>
                  <option value="target_high" className="bg-gray-900 text-white">
                    Sort: Target (High to Low)
                  </option>
                  <option value="target_low" className="bg-gray-900 text-white">
                    Sort: Target (Low to High)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <svg
              className="w-8 h-8 animate-spin mx-auto text-brand-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-sm font-semibold text-gray-400">
              Querying Ethereum Blockchain...
            </p>
          </div>
        ) : (
          <Card
            title={
              activeTab === "my"
                ? "My Created Campaigns"
                : activeTab === "active"
                ? "Active Fundraising Campaigns"
                : activeTab === "funded"
                ? "Fully Funded Campaigns"
                : "All Listed Campaigns"
            }
            subtitle={
              activeTab === "my"
                ? "Manage and monitor funding status for campaigns you initiated."
                : "Explore transparent initiatives backed by smart contract security."
            }
            allCampaign={displayedCampaigns}
            setOpenModel={setOpenModel}
            setDonate={setDonateCampaign}
            address={currentAccount}
            onOpenCreateModal={() => setOpenCreateModal(true)}
          />
        )}
      </main>

      {/* Donation Popup Modal */}
      {openModel && donateCampaign && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}

      {/* Dedicated Campaign Creation Modal */}
      <CreateCampaignModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />

      {/* Modern Footer */}
      <Footer />
    </div>
  );
};

export default Index;
