import React, { useState, useRef, useEffect, useMemo } from "react";

// Category color mappings for enhanced visual cues
const CATEGORY_COLORS = {
  "Technology & AI": "from-blue-500 to-indigo-500",
  "DeFi & Web3": "from-purple-500 to-pink-500",
  "Creative & Art": "from-pink-500 to-rose-500",
  "Social Impact & Green": "from-emerald-500 to-teal-500",
  "Education & Research": "from-amber-500 to-orange-500",
  "Gaming & Metaverse": "from-violet-500 to-cyan-500",
  "Community DAO": "from-cyan-500 to-blue-500",
  "General": "from-gray-400 to-slate-500",
};

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  size = "md", // 'sm' | 'md' | 'lg'
  variant = "input", // 'input' | 'pill'
  showSearch = false,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, showSearch]);

  const selectedOption = options.find((opt) =>
    typeof opt === "object" ? opt.value === value : opt === value
  );

  const getLabel = (opt) => (typeof opt === "object" ? opt.label : opt);
  const getValue = (opt) => (typeof opt === "object" ? opt.value : opt);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((opt) =>
      getLabel(opt).toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const sizeStyles = {
    sm: "h-9 text-xs px-3 rounded-xl",
    md: "h-11 text-xs px-3.5 rounded-xl",
    lg: "h-12 text-sm px-4 rounded-xl",
  }[size] || "h-11 text-xs px-3.5 rounded-xl";

  const selectedLabel = selectedOption ? getLabel(selectedOption) : "";
  const categoryGradient = CATEGORY_COLORS[selectedLabel] || "from-brand-400 to-purple-400";

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {helperText && (
            <span className="text-[10px] text-gray-500 font-normal lowercase">
              {helperText}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${sizeStyles} glass-input flex items-center justify-between gap-2.5 text-left font-medium transition-all duration-200 cursor-pointer select-none group ${
          isOpen
            ? "border-brand-500/80 ring-2 ring-brand-500/25 bg-gray-900/95 shadow-lg shadow-brand-500/10"
            : "hover:border-white/25 hover:bg-white/[0.07] hover:shadow-md"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {/* Subtle glowing indicator bullet */}
          <span
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryGradient} shrink-0 shadow-sm transition-transform duration-200 ${
              isOpen ? "scale-125" : "group-hover:scale-110"
            }`}
          ></span>

          <span
            className={`truncate ${
              selectedOption
                ? "text-white font-semibold tracking-tight"
                : "text-gray-400 font-normal"
            }`}
          >
            {selectedOption ? selectedLabel : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Animated chevron with glass hover state */}
          <div
            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isOpen
                ? "bg-brand-500/20 text-brand-400 rotate-180"
                : "text-gray-400 group-hover:text-gray-200 group-hover:bg-white/5"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown Floating Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-50 glass-modal rounded-2xl p-1.5 shadow-2xl shadow-black/80 border border-white/15 animate-dropdown backdrop-blur-2xl overflow-hidden"
          role="listbox"
        >
          {/* Optional Search Filter inside Dropdown */}
          {(showSearch || options.length > 7) && (
            <div className="p-1.5 pb-2 border-b border-white/10 mb-1">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Filter options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-7 pr-7 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
                <svg
                  className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5"
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
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-400">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const optVal = getValue(opt);
                const optLabel = getLabel(opt);
                const isSelected = value === optVal;
                const optGradient =
                  CATEGORY_COLORS[optLabel] || "from-brand-400 to-purple-400";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(optVal);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all duration-150 text-left group/item cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold shadow-md shadow-brand-600/30 ring-1 ring-white/15"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.08]"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2.5 truncate min-w-0">
                      {/* Gradient dot indicator */}
                      <span
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${optGradient} shrink-0 transition-transform duration-150 ${
                          isSelected
                            ? "scale-110 shadow-sm"
                            : "opacity-75 group-hover/item:opacity-100 group-hover/item:scale-110"
                        }`}
                      ></span>
                      <span className="truncate">{optLabel}</span>
                    </div>

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-2">
                        <svg
                          className="w-2.5 h-2.5 text-white stroke-[3]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
