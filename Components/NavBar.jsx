import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import Logo from "./Logo";

const NavBar = ({ onOpenCreateModal, activeTab, setActiveTab }) => {
  const { currentAccount, accountBalance, network, connectWallet, disconnectWallet, isLoading } =
    useContext(CrowdFundingContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!currentAccount) return;
    navigator.clipboard.writeText(currentAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { name: "Explore All", tab: "all" },
    { name: "My Campaigns", tab: "my" },
    { name: "Stats & Analytics", tab: "stats" },
  ];

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Logo color="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Crypto<span className="text-gradient">Fund</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  DeFi Crowdfunding
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {navLinks.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab && setActiveTab(item.tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === item.tab
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Create Campaign CTA */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-2 hover:border-brand-500/40"
            >
              <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Launch Campaign</span>
            </button>

            {/* Wallet Section */}
            {currentAccount ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 pl-3">
                {/* Balance & Network */}
                <div className="flex items-center gap-2 pr-2 text-xs font-medium text-gray-300 border-r border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white font-bold">{accountBalance} ETH</span>
                </div>

                {/* Account Address Pill with Copy */}
                <button
                  onClick={copyAddress}
                  title="Click to copy address"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors text-xs font-mono font-semibold"
                >
                  <span>{formatAddress(currentAccount)}</span>
                  {copied ? (
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 opacity-60 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                {/* Disconnect Button */}
                <button
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-white/10 space-y-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.tab);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.tab
                      ? "bg-brand-600 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenCreateModal();
                  setIsMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-white/10 border border-white/10 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Launch Campaign
              </button>

              {currentAccount ? (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-mono">{formatAddress(currentAccount)}</span>
                    <span className="font-bold text-emerald-400">{accountBalance} ETH</span>
                  </div>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white gradient-btn"
                >
                  Connect MetaMask Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
