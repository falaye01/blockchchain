// IPFS & Decentralized Media Helpers

export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
];

/**
 * Resolves an IPFS URI or standard URL into an accessible image URL
 */
export const resolveIpfsUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("ipfs://")) {
    return `${IPFS_GATEWAYS[0]}${trimmed.replace("ipfs://", "")}`;
  }
  if (trimmed.startsWith("Qm") || trimmed.startsWith("bafy")) {
    return `${IPFS_GATEWAYS[0]}${trimmed}`;
  }
  return trimmed;
};

/**
 * Available Project Categories with preset identifiers
 */
export const PROJECT_CATEGORIES = [
  "Tech & AI",
  "Open Source",
  "Green Energy",
  "Social Impact",
  "Creative & Media",
  "Gaming",
  "Education & Research",
  "General",
];

/**
 * Default fallback banner images by category
 */
export const CATEGORY_DEFAULT_IMAGES = {
  "Tech & AI": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "Open Source": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  "Green Energy": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
  "Social Impact": "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80",
  "Creative & Media": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  "Gaming": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
  "Education & Research": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  "General": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
};
