import React, { useState, useEffect, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

const PopUp = ({ setOpenModel, donate, donateFunction, getDonations }) => {
  const { currentAccount, connectWallet, accountBalance, isLoading } =
    useContext(CrowdFundingContext);

  const [amount, setAmount] = useState("");
  const [allDonationData, setAllDonationData] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(null);

  const presetAmounts = ["0.01", "0.05", "0.1", "0.5", "1.0"];

  useEffect(() => {
    let isMounted = true;
    const fetchDonations = async () => {
      try {
        setLoadingDonations(true);
        const data = await getDonations(donate.pId);
        if (isMounted) setAllDonationData(data || []);
      } catch (err) {
        console.error("Error loading donations in modal:", err);
      } finally {
        if (isMounted) setLoadingDonations(false);
      }
    };

    if (donate && donate.pId !== undefined) {
      fetchDonations();
    }

    return () => {
      isMounted = false;
    };
  }, [donate?.pId, getDonations]);

  const handleDonateSubmit = async (e) => {
    e?.preventDefault();
    if (!currentAccount) {
      await connectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) return;

    const success = await donateFunction(donate.pId, amount);
    if (success) {
      setOpenModel(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const percentageNum = Math.min(100, Math.max(0, parseFloat(donate?.percentage) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-modal rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setOpenModel(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            🤝 Campaign Contribution
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {donate?.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {donate?.description}
          </p>
        </div>

        {/* Campaign Metrics Summary */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-semibold">Funded Progress</span>
            <span className="text-brand-300 font-bold">{donate?.percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full gradient-btn transition-all duration-500"
              style={{ width: `${percentageNum}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
            <div>
              <span className="text-gray-400">Raised: </span>
              <span className="text-white font-bold">{donate?.amountCollected} ETH</span>
            </div>
            <div>
              <span className="text-gray-400">Target: </span>
              <span className="text-white font-bold">{donate?.target} ETH</span>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        {!donate?.isExpired && (
          <form onSubmit={handleDonateSubmit} className="mb-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Contribution Amount
                </label>
                {currentAccount && (
                  <span className="text-[11px] text-gray-400">
                    Wallet Balance: <strong className="text-emerald-400">{accountBalance} ETH</strong>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  required
                  placeholder="0.05"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-12 pl-4 pr-16 rounded-xl glass-input text-base font-semibold"
                />
                <span className="absolute right-4 top-3.5 text-xs font-extrabold text-brand-400">
                  ETH
                </span>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    amount === val
                      ? "bg-brand-600 border-brand-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  +{val} ETH
                </button>
              ))}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className="w-full h-12 rounded-xl text-sm font-bold text-white gradient-btn shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Processing Donation...</span>
                </>
              ) : currentAccount ? (
                `Confirm & Donate ${amount ? `${amount} ETH` : ""}`
              ) : (
                "Connect Wallet to Donate"
              )}
            </button>
          </form>
        )}

        {/* Donators History Section */}
        <div className="pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Recent Donors & Backers ({allDonationData.length})
            </h4>
            <span className="text-[10px] text-gray-500">Immutable on-chain history</span>
          </div>

          {loadingDonations ? (
            <div className="p-6 text-center text-xs text-gray-400">
              <svg className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading donator records...
            </div>
          ) : allDonationData.length > 0 ? (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {allDonationData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => copyAddress(item.donator)}
                      title="Click to copy address"
                      className="font-mono text-gray-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>{formatAddress(item.donator)}</span>
                      {copiedAddress === item.donator ? (
                        <span className="text-[9px] text-emerald-400 font-sans font-bold">
                          Copied!
                        </span>
                      ) : (
                        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="font-extrabold text-emerald-400 font-mono">
                    +{parseFloat(item.donation).toFixed(4)} ETH
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-400 bg-white/5 rounded-xl border border-white/5">
              🌟 No donations yet. Be the pioneer backer of this campaign!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
