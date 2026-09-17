import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CrowdFundingABI, CrowdFundingAddress } from "./constants";
import { resolveIpfsUrl, CATEGORY_DEFAULTIMAGES, CATEGORY_DEFAULT_IMAGES } from "./ipfs";

const toSafeNumber = (bn, fallback = 0) => {
  if (bn === undefined || bn === null) return fallback;
  try {
    if (typeof bn === "number") return bn;
    if (bn._isBigNumber || typeof bn.toString === "function") {
      const str = bn.toString();
      const num = Number(str);
      return Number.isSafeInteger(num) ? num : fallback;
    }
    return Number(bn) || fallback;
  } catch (err) {
    return fallback;
  }
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Decentralized Crowdfunding Platform";
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("0");
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Helper to trigger UI refreshes
  const triggerRefresh = () => setRefreshIndex((prev) => prev + 1);

  // Show auto-dismissing notifications
  const notify = (type, message, duration = 6000) => {
    setNotification({ type, message });
    if (duration > 0) {
      setTimeout(() => {
        setNotification((curr) => (curr?.message === message ? null : curr));
      }, duration);
    }
  };

  // Helper to safely get the injected MetaMask provider
  const getInjectedEthereum = () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      return window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum.providers[0];
    }
    return window.ethereum;
  };

  // Helper for mobile deep-linking or missing wallet guidance
  const handleMobileOrMissingWallet = (actionMsg = "interact with this protocol") => {
    if (typeof window !== "undefined") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const dappHost = window.location.href.replace(/^https?:\/\//, "");
        notify("info", "Redirecting to MetaMask Mobile in-app browser...");
        window.location.href = `https://metamask.app.link/dapp/${dappHost}`;
        return;
      }
    }
    notify("error", `MetaMask was not detected. Please install MetaMask or open this dApp inside your Web3 mobile browser to ${actionMsg}.`);
  };

  // Get active provider (browser wallet or fallback JsonRpc)
  const getProvider = useCallback(() => {
    const injected = getInjectedEthereum();
    if (injected) {
      return new ethers.providers.Web3Provider(injected, "any");
    }
    const fallbackRpc =
      process.env.NEXT_PUBLIC_RPC_URL ||
      (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://127.0.0.1:8545"
        : "https://ethereum-sepolia-rpc.publicnode.com");
    return new ethers.providers.JsonRpcProvider(fallbackRpc);
  }, []);

  // Fetch contract instance with signer or provider
  const getContract = useCallback(
    (signerOrProvider) => {
      const provider = signerOrProvider || getProvider();
      return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);
    },
    [getProvider]
  );

  // Automatically ensure wallet is on the correct network (Sepolia on production / 31337 on local)
  const ensureCorrectNetwork = async () => {
    const ethereum = getInjectedEthereum();
    if (!ethereum) return;

    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    const targetChainId = isLocal ? "0x7a69" : "0xaa36a7"; // 31337 or 11155111 (Sepolia)

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          if (isLocal) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x7a69",
                  chainName: "Hardhat Localhost",
                  rpcUrls: ["http://127.0.0.1:8545"],
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                },
              ],
            });
          } else {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia",
                  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  // Update balance for current account
  const updateBalance = async (account) => {
    try {
      if (!account) return;
      const ethereum = getInjectedEthereum();
      if (!ethereum) return;
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const balance = await provider.getBalance(account);
      setAccountBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
    } catch (err) {
      console.warn("Could not fetch account balance", err);
    }
  };

  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = getInjectedEthereum();
      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const accounts = await provider.listAccounts();

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        const net = await provider.getNetwork().catch(() => null);
        setNetwork(net);
        await updateBalance(account);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  // Connect wallet on user action
  const connectWallet = async () => {
    try {
      const ethereum = getInjectedEthereum();

      if (!ethereum) {
        handleMobileOrMissingWallet("connect your wallet");
        return;
      }

      setIsLoading(true);

      let accounts;
      try {
        await ensureCorrectNetwork();
        accounts = await ethereum.request({ method: "eth_requestAccounts" });
      } catch (reqErr) {
        if (reqErr.code === -32002) {
          notify("info", "MetaMask has a pending request. Click the MetaMask extension icon to approve.");
          return;
        }
        if (reqErr.code === 4001) {
          notify("info", "Connection request was cancelled in MetaMask.");
          return;
        }
        throw reqErr;
      }

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);

        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const net = await provider.getNetwork().catch(() => null);
        setNetwork(net);

        await updateBalance(account);
        notify("success", `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
        triggerRefresh();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      const msg = error?.message || "Failed to connect wallet.";
      notify("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setCurrentAccount("");
    setAccountBalance("0");
    notify("info", "Wallet disconnected.");
  };

  // Create Campaign (with Image & Category support)
  const createCampaign = async ({ title, description, amount, deadline, image = "", category = "General" }) => {
    try {
      if (!title || !description || !amount || !deadline) {
        notify("error", "Please fill in all required campaign fields.");
        return false;
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        notify("error", "Target amount must be greater than zero.");
        return false;
      }

      const deadlineDate = new Date(deadline);
      const deadlineSeconds = Math.floor(deadlineDate.getTime() / 1000);
      const nowSeconds = Math.floor(Date.now() / 1000);

      if (isNaN(deadlineSeconds) || deadlineSeconds <= nowSeconds) {
        notify("error", "Deadline must be in the future.");
        return false;
      }

      const ethereum = getInjectedEthereum();
      if (!ethereum) {
        handleMobileOrMissingWallet("create a campaign");
        return false;
      }

      setIsLoading(true);
      await ensureCorrectNetwork();
      notify("info", "Please confirm transaction in your MetaMask wallet...");

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = getContract(signer);

      const targetInWei = ethers.utils.parseEther(amount.toString());
      const cleanCategory = category || "General";
      const cleanImage = image ? image.trim() : (CATEGORY_DEFAULT_IMAGES[cleanCategory] || "");

      const tx = await contract.createCampaign(
        userAddress,
        title.trim(),
        description.trim(),
        targetInWei,
        deadlineSeconds,
        cleanImage,
        cleanCategory
      );

      notify("info", "Transaction submitted. Waiting for confirmation...", 0);
      await tx.wait();

      notify("success", "Campaign created successfully.");
      if (currentAccount) await updateBalance(currentAccount);
      triggerRefresh();
      return true;
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (error?.code === 4001 || error?.code === "ACTION_REJECTED") {
        notify("info", "Transaction was cancelled in MetaMask.");
        return false;
      }
      const errorMsg =
        error?.reason || error?.data?.message || error?.message || "Failed to create campaign.";
      notify("error", errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all campaigns
  const getCampaigns = async () => {
    try {
      const contract = getContract();
      const campaigns = await contract.getCampaigns();

      const parsedCampaigns = campaigns.map((campaign, i) => {
        const deadlineSec = toSafeNumber(campaign.deadline);
        const targetEth = ethers.utils.formatEther(campaign.target.toString());
        const collectedEth = ethers.utils.formatEther(campaign.amountCollected.toString());
        const nowSec = Math.floor(Date.now() / 1000);
        const isExpired = nowSec > deadlineSec;
        const isGoalReached = parseFloat(collectedEth) >= parseFloat(targetEth);
        const categoryVal = campaign.category || "General";
        const bannerImage = campaign.image ? resolveIpfsUrl(campaign.image) : (CATEGORY_DEFAULT_IMAGES[categoryVal] || CATEGORY_DEFAULT_IMAGES["General"]);

        return {
          pId: i,
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: targetEth,
          deadline: deadlineSec,
          amountCollected: collectedEth,
          image: bannerImage,
          category: categoryVal,
          donators: campaign.donators || [],
          donations: (campaign.donations || []).map((d) => ethers.utils.formatEther(d)),
          isExpired,
          isGoalReached,
          percentage:
            parseFloat(targetEth) > 0
              ? Math.min(100, (parseFloat(collectedEth) / parseFloat(targetEth)) * 100).toFixed(1)
              : "0",
        };
      });

      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  // Fetch campaigns belonging to current user
  const getUserCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      if (!currentAccount) return [];

      return allCampaigns.filter(
        (campaign) => campaign.owner.toLowerCase() === currentAccount.toLowerCase()
      );
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
      return [];
    }
  };

  // Donate to a campaign
  const donate = async (pId, amount) => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        notify("error", "Please enter a valid contribution amount.");
        return false;
      }

      const ethereum = getInjectedEthereum();
      if (!ethereum) {
        handleMobileOrMissingWallet("make a contribution");
        return false;
      }

      setIsLoading(true);
      await ensureCorrectNetwork();
      notify("info", "Please confirm transaction in your MetaMask wallet...");

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.donateToCampaign(pId, {
        value: ethers.utils.parseEther(amount.toString()),
      });

      notify("info", "Transaction submitted. Waiting for confirmation...", 0);
      await tx.wait();

      notify("success", `Thank you! Successfully contributed ${amount} ETH.`);
      if (currentAccount) await updateBalance(currentAccount);
      triggerRefresh();
      return true;
    } catch (error) {
      console.error("Donation failed:", error);
      if (error?.code === 4001 || error?.code === "ACTION_REJECTED") {
        notify("info", "Transaction was cancelled in MetaMask.");
        return false;
      }
      const errorMsg =
        error?.reason || error?.data?.message || error?.message || "Contribution transaction failed.";
      notify("error", errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Post a project update (creator only)
  const postUpdate = async (pId, title, content) => {
    try {
      if (!title || !content) {
        notify("error", "Please enter both an update title and content.");
        return false;
      }

      const ethereum = getInjectedEthereum();
      if (!ethereum) {
        handleMobileOrMissingWallet("post an update");
        return false;
      }

      setIsLoading(true);
      notify("info", "Please confirm update transaction in MetaMask...");

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.postUpdate(pId, title.trim(), content.trim());
      notify("info", "Submitting update to blockchain...", 0);
      await tx.wait();

      notify("success", "Project update published on-chain.");
      triggerRefresh();
      return true;
    } catch (error) {
      console.error("Error posting update:", error);
      const errorMsg =
        error?.reason || error?.data?.message || error?.message || "Failed to publish update.";
      notify("error", errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get project updates for a campaign
  const getUpdates = async (pId) => {
    try {
      const contract = getContract();
      const updates = await contract.getUpdates(pId);
      return (updates || []).map((u) => ({
        timestamp: toSafeNumber(u.timestamp),
        title: u.title,
        content: u.content,
      }));
    } catch (error) {
      console.error(`Error fetching updates for campaign #${pId}:`, error);
      return [];
    }
  };

  // Add a community discussion comment
  const addComment = async (pId, message) => {
    try {
      if (!message || !message.trim()) {
        notify("error", "Please enter a comment message.");
        return false;
      }

      const ethereum = getInjectedEthereum();
      if (!ethereum) {
        handleMobileOrMissingWallet("post a comment");
        return false;
      }

      setIsLoading(true);
      notify("info", "Please confirm comment transaction in MetaMask...");

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.addComment(pId, message.trim());
      notify("info", "Posting comment on-chain...", 0);
      await tx.wait();

      notify("success", "Comment posted successfully.");
      triggerRefresh();
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMsg =
        error?.reason || error?.data?.message || error?.message || "Failed to add comment.";
      notify("error", errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get community discussion comments
  const getComments = async (pId) => {
    try {
      const contract = getContract();
      const comments = await contract.getComments(pId);
      return (comments || []).map((c) => ({
        commenter: c.commenter,
        timestamp: toSafeNumber(c.timestamp),
        message: c.message,
      }));
    } catch (error) {
      console.error(`Error fetching comments for campaign #${pId}:`, error);
      return [];
    }
  };

  // Get donators and donations for a campaign
  const getDonations = async (pId) => {
    try {
      const contract = getContract();
      const [donators, donations] = await contract.getDonators(pId);
      const parsedDonations = [];
      for (let i = 0; i < donators.length; i++) {
        parsedDonations.push({
          donator: donators[i],
          donation: ethers.utils.formatEther(donations[i].toString()),
        });
      }
      return parsedDonations;
    } catch (error) {
      console.error(`Error fetching donations for campaign #${pId}:`, error);
      return [];
    }
  };

  // Setup wallet event listeners
  useEffect(() => {
    checkIfWalletIsConnected();

    const ethereum = getInjectedEthereum();
    if (ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts && accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          updateBalance(accounts[0]);
          notify("info", `Switched account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        } else {
          setCurrentAccount("");
          setAccountBalance("0");
          notify("info", "Wallet disconnected.");
        }
        triggerRefresh();
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        accountBalance,
        network,
        isLoading,
        notification,
        setNotification,
        notify,
        refreshIndex,
        triggerRefresh,
        connectWallet,
        disconnectWallet,
        switchNetworkToLocalhost,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        postUpdate,
        getUpdates,
        addComment,
        getComments,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
