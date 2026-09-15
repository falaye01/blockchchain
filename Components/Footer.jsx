import React from "react";
import Logo from "./Logo";
import { CrowdFundingAddress } from "../Context/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#070b12] text-gray-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center">
                <Logo color="text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Crypto<span className="text-gradient">Fund</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              A decentralized, trustless, and peer-to-peer crowdfunding protocol built with Ethereum smart contracts. Zero platform fees, 100% direct creator payouts.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] text-gray-500 font-semibold">Contract:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-indigo-300 text-[11px]">
                {formatAddress(CrowdFundingAddress)}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#campaigns-section" className="hover:text-white transition-colors">
                  Explore Campaigns
                </a>
              </li>
              <li>
                <a href="#campaigns-section" className="hover:text-white transition-colors">
                  My Portfolio
                </a>
              </li>
              <li>
                <a href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Ethereum Web3 Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Security & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Checks-Effects-Interactions
                </span>
              </li>
              <li>
                <span className="text-gray-400">Reentrancy Guarded</span>
              </li>
              <li>
                <span className="text-gray-400">Hardhat & Ethers.js v5</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400">
            © {currentYear} CryptoFund Protocol • Built by{" "}
            <span className="text-white font-semibold hover:text-brand-400 transition-colors">
              ComradeDeveloper
            </span>{" "}
            • Open-Source Web3 Architecture
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Smart Contract Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
