import React, { useState, useEffect, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

const CampaignDetailsModal = ({ campaign, isOpen, onClose, onOpenDonate }) => {
  const {
    currentAccount,
    connectWallet,
    postUpdate,
    getUpdates,
    addComment,
    getComments,
    isLoading,
    refreshIndex,
  } = useContext(CrowdFundingContext);

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'updates' | 'discussion' | 'donors'
  const [updates, setUpdates] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Form states
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [copied, setCopied] = useState(false);

  const isOwner =
    currentAccount &&
    campaign?.owner &&
    currentAccount.toLowerCase() === campaign.owner.toLowerCase();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!campaign || campaign.pId === undefined) return;
      try {
        setLoadingUpdates(true);
        setLoadingComments(true);
        const [fetchedUpdates, fetchedComments] = await Promise.all([
          getUpdates(campaign.pId),
          getComments(campaign.pId),
        ]);
        if (isMounted) {
          setUpdates(fetchedUpdates || []);
          setComments(fetchedComments || []);
        }
      } catch (err) {
        console.error("Error loading campaign details data:", err);
      } finally {
        if (isMounted) {
          setLoadingUpdates(false);
          setLoadingComments(false);
        }
      }
    };

    if (isOpen) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [campaign?.pId, isOpen, getUpdates, getComments, refreshIndex]);

  if (!isOpen || !campaign) return null;

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    const success = await postUpdate(campaign.pId, updateTitle, updateContent);
    if (success) {
      setUpdateTitle("");
      setUpdateContent("");
      const refreshed = await getUpdates(campaign.pId);
      setUpdates(refreshed || []);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      await connectWallet();
      return;
    }
    const success = await addComment(campaign.pId, newComment);
    if (success) {
      setNewComment("");
      const refreshed = await getComments(campaign.pId);
      setComments(refreshed || []);
    }
  };

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestampSec) => {
    if (!timestampSec) return "";
    return new Date(timestampSec * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-modal rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-white max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Media Banner */}
        {campaign.image && (
          <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-6 relative">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold shadow-md">
                {campaign.category || "General"}
              </span>
            </div>
          </div>
        )}

        {/* Title and Creator */}
        <div className="mb-6 space-y-2">
          {!campaign.image && (
            <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
              {campaign.category || "General"}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {campaign.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <button
              onClick={() => copyAddress(campaign.owner)}
              className="flex items-center gap-1.5 font-mono hover:text-white transition-colors"
            >
              <span>Creator: {formatAddress(campaign.owner)}</span>
              {copied ? (
                <span className="text-emerald-400 font-sans font-medium">Copied</span>
              ) : (
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <span>•</span>
            <span>Target: {parseFloat(campaign.target).toFixed(3)} ETH</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">
              Raised: {parseFloat(campaign.amountCollected).toFixed(3)} ETH ({campaign.percentage}%)
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 ${
              activeTab === "overview"
                ? "border-brand-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Project Story
          </button>
          <button
            onClick={() => setActiveTab("updates")}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "updates"
                ? "border-brand-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Updates</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {updates.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "discussion"
                ? "border-brand-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Discussion</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {comments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("donors")}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "donors"
                ? "border-brand-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Contributors</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {campaign.donators?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                About the Initiative
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[11px] text-gray-400">Deadline</span>
                <p className="text-xs font-semibold text-white">
                  {formatDate(campaign.deadline)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[11px] text-gray-400">Total Backers</span>
                <p className="text-xs font-semibold text-white">
                  {campaign.donators?.length || 0} Backers
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-gray-400">Funding Status</span>
                <p className="text-xs font-semibold text-emerald-400">
                  {campaign.isGoalReached
                    ? "Goal Achieved"
                    : campaign.isExpired
                    ? "Campaign Ended"
                    : "Active"}
                </p>
              </div>
            </div>

            {!campaign.isExpired && !isOwner && onOpenDonate && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDonate(campaign);
                }}
                className="w-full py-3.5 rounded-xl text-xs font-semibold text-white gradient-btn shadow-lg"
              >
                Back this Project
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Project Updates */}
        {activeTab === "updates" && (
          <div className="space-y-6">
            {/* Creator Post Update Form */}
            {isOwner && (
              <form onSubmit={handlePostUpdate} className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-3">
                <h4 className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                  Post a Project Update (Creator Only)
                </h4>
                <input
                  type="text"
                  required
                  placeholder="Update headline (e.g. Milestone 1 Complete)"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl glass-input text-xs"
                />
                <textarea
                  required
                  rows="3"
                  placeholder="Share progress, development notes, or next steps with your backers..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn disabled:opacity-50"
                >
                  {isLoading ? "Publishing on-chain..." : "Publish Update"}
                </button>
              </form>
            )}

            {/* Updates Feed */}
            {loadingUpdates ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Loading project updates...
              </div>
            ) : updates.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-white/5 rounded-2xl border border-white/5">
                No updates published yet.
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((u, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-white text-sm">{u.title}</h4>
                      <span className="text-gray-500 text-[11px]">{formatDate(u.timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                      {u.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Community Discussion */}
        {activeTab === "discussion" && (
          <div className="space-y-6">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                required
                rows="2"
                placeholder="Ask a question or leave encouragement for the creator..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-btn disabled:opacity-50"
                >
                  {isLoading ? "Posting..." : currentAccount ? "Post Comment" : "Connect Wallet & Post"}
                </button>
              </div>
            </form>

            {/* Comments List */}
            {loadingComments ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-white/5 rounded-2xl border border-white/5">
                No comments yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {comments.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-mono text-indigo-300 font-semibold">
                        {formatAddress(c.commenter)}
                      </span>
                      <span className="text-gray-500">{formatDate(c.timestamp)}</span>
                    </div>
                    <p className="text-gray-200 text-xs">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Contributors List */}
        {activeTab === "donors" && (
          <div className="space-y-3">
            {campaign.donators && campaign.donators.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {campaign.donators.map((donorAddr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-gray-300">{formatAddress(donorAddr)}</span>
                    </div>
                    <span className="font-bold text-emerald-400 font-mono">
                      {campaign.donations?.[idx] ? `+${parseFloat(campaign.donations[idx]).toFixed(4)} ETH` : "Contributed"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 bg-white/5 rounded-2xl border border-white/5">
                No contributions yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailsModal;
