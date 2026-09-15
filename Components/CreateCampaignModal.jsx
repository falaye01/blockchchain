import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { PROJECT_CATEGORIES, CATEGORY_DEFAULT_IMAGES } from "../Context/ipfs";
import CustomDropdown from "./CustomDropdown";
import CustomDatePicker from "./CustomDatePicker";

const CreateCampaignModal = ({ isOpen, onClose }) => {
  const { createCampaign, isLoading, currentAccount, connectWallet } =
    useContext(CrowdFundingContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    category: "Tech & AI",
    image: "",
  });

  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      await connectWallet();
      return;
    }

    const success = await createCampaign(formData);
    if (success) {
      setFormData({
        title: "",
        description: "",
        amount: "",
        deadline: "",
        category: "Tech & AI",
        image: "",
      });
      onClose();
    }
  };

  const previewImage =
    formData.image.trim() ||
    CATEGORY_DEFAULT_IMAGES[formData.category] ||
    CATEGORY_DEFAULT_IMAGES["General"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-modal rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-white max-h-[90vh] overflow-y-auto">
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

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
            New Campaign
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Start a Campaign
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Publish your project with media and category tags directly on the blockchain.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Open Source Developer Workspace"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Custom Category Dropdown */}
            <CustomDropdown
              label="Category *"
              options={PROJECT_CATEGORIES}
              value={formData.category}
              onChange={(cat) => setFormData({ ...formData, category: cat })}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Target Amount (ETH) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full h-11 pl-4 pr-12 rounded-xl glass-input text-sm"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-gray-400">
                  ETH
                </span>
              </div>
            </div>
          </div>

          {/* Custom Date Picker */}
          <CustomDatePicker
            label="Target Deadline *"
            value={formData.deadline}
            onChange={(dateStr) => setFormData({ ...formData, deadline: dateStr })}
            minDate={minDateStr}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Banner Image (IPFS or URL)
            </label>
            <input
              type="text"
              placeholder="ipfs://... or https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input text-sm"
            />
            {previewImage && (
              <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-white/10 relative">
                <img
                  src={previewImage}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = CATEGORY_DEFAULT_IMAGES["General"];
                  }}
                />
                <span className="absolute bottom-1 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-gray-300">
                  Preview
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Describe your initiative and how the funds will be used..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 h-11 rounded-xl text-sm font-semibold text-white gradient-btn flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : currentAccount ? (
                "Publish Campaign"
              ) : (
                "Connect Wallet & Publish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
