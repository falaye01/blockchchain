import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import Logo from "./Logo";

const NavBar = ({ onOpenCreateModal, activeTab, setActiveTab }) => {
  const { currentAccount, accountBalance, connectWallet, disconnectWallet, isLoading } =
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

  const handleNavClick = (tab) => {
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== "undefined") {
      const section = document.getElementById("campaigns-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

          {/* Right Action Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Create Campaign CTA */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-2 hover:border-brand-500/40 cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors text-xs font-mono font-semibold cursor-pointer"
                >
                  <span>{formatAddress(currentAccount)}</span>
                  {copied ? (
                    <span className="text-[10px] text-emerald-400 font-sans font-medium">
                      Copied!
                    </span>
                  ) : (
                    <svg className="w-3.5 h-3.5 opacity-60 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                {/* Faucet Quick Link */}
                <a
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noreferrer"
                  title="Get Free Sepolia Test ETH"
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
                >
                  Faucet
                </a>

                {/* Disconnect Button */}
                <button
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-btn flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
          </div>

          {/* Mobile Right Bar: Quick Address/Balance Pill + Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            {currentAccount && (
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{formatAddress(currentAccount)}</span>
                {copied && (
                  <span className="text-[10px] text-emerald-400 font-sans font-bold">
                    ✓
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="lg:hidden pb-6 pt-3 border-t border-white/10 space-y-4 animate-fadeIn">
            {/* Nav Tabs */}
            <div className="flex flex-col gap-1.5">
              {navLinks.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    handleNavClick(item.tab);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === item.tab
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Launch Campaign CTA */}
            <button
              onClick={() => {
                onOpenCreateModal();
                setIsMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Launch Campaign</span>
            </button>

            {/* Mobile Wallet & Faucet Management Card */}
            {currentAccount ? (
              <div className="p-4 bg-gray-900/90 rounded-2xl border border-white/15 space-y-3.5 shadow-xl backdrop-blur-xl">
                {/* Header: Network Status */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    Connected Wallet
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Sepolia Network</span>
                  </div>
                </div>

                {/* Address & Copy Button */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Your Wallet Address</span>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <span className="font-mono text-xs text-indigo-300 truncate">
                      {currentAccount}
                    </span>
                    <button
                      onClick={copyAddress}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <span>✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-400">Balance:</span>
                  <span className="text-sm font-extrabold text-white">
                    {accountBalance} <span className="text-brand-400 font-semibold text-xs">ETH</span>
                  </span>
                </div>

                {/* 1-Click Faucet Funding Button */}
                <div className="pt-1">
                  <a
                    href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all text-center"
                  >
                    <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Get Free Test ETH (Faucet)</span>
                  </a>
                  <p className="text-[10px] text-gray-500 text-center mt-1">
                    Opens Google Cloud Faucet • Paste your copied address to get 0.05 ETH
                  </p>
                </div>

                {/* Links: Etherscan & Disconnect */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <a
                    href={`https://sepolia.etherscan.io/address/${currentAccount}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <span>View on Etherscan</span>
                    <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsMenuOpen(false);
                    }}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white gradient-btn shadow-lg cursor-pointer"
                >
                  Connect MetaMask Wallet
                </button>
                <div className="text-center">
                  <a
                    href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand-400 hover:underline"
                  >
                    Need free Sepolia test funds? Open Faucet ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
