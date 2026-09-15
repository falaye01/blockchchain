import React, { useState, useRef, useEffect } from "react";

const CustomDatePicker = ({
  value,
  onChange,
  label = "Target Deadline",
  placeholder = "Select deadline date",
  className = "",
  minDate,
  size = "md",
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minimumDate = minDate
    ? new Date(minDate + "T00:00:00")
    : new Date(today.getTime() + 86400000); // default to tomorrow

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  // View state for navigating calendar
  const [viewDate, setViewDate] = useState(
    selectedDate && !isNaN(selectedDate)
      ? new Date(selectedDate)
      : new Date(minimumDate)
  );

  // Sync viewDate when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d)) setViewDate(new Date(d));
    }
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Quick Preset Handlers
  const presets = [
    { label: "14d", days: 14, title: "2 Weeks" },
    { label: "30d", days: 30, title: "1 Month" },
    { label: "60d", days: 60, title: "2 Months" },
    { label: "90d", days: 90, title: "1 Quarter" },
    { label: "180d", days: 180, title: "6 Months" },
  ];

  const handlePresetSelect = (days) => {
    const target = new Date(today.getTime() + days * 86400000);
    const dateStr = target.toISOString().split("T")[0];
    onChange(dateStr);
    setViewDate(new Date(target));
  };

  // Month navigation
  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrevYear = () => {
    setViewDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const handleNextYear = () => {
    setViewDate(new Date(currentYear + 1, currentMonth, 1));
  };

  // Day selection
  const handleDaySelect = (dayNumber) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    onChange(formatted);
  };

  // Format date display
  const formatDisplay = (val) => {
    if (!val) return "";
    const d = new Date(val + "T00:00:00");
    if (isNaN(d)) return val;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Relative days calculation
  const getDaysInfo = (val) => {
    if (!val) return null;
    const d = new Date(val + "T00:00:00");
    if (isNaN(d)) return null;
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diff <= 0) return { text: "Today", isWarning: true };
    if (diff === 1) return { text: "Tomorrow", isWarning: true };
    return { text: `${diff} days left`, isWarning: false };
  };

  const daysInfo = getDaysInfo(value);

  // Calendar calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const sizeStyles = {
    sm: "h-9 text-xs px-3 rounded-xl",
    md: "h-11 text-xs px-3.5 rounded-xl",
    lg: "h-12 text-sm px-4 rounded-xl",
  }[size] || "h-11 text-xs px-3.5 rounded-xl";

  const isTodayDate = (dayNum) => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === dayNum
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
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
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {/* Calendar SVG Icon */}
          <div className="w-6 h-6 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-400 group-hover:scale-105 transition-transform">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <span
            className={`truncate ${
              value ? "text-white font-semibold" : "text-gray-400 font-normal"
            }`}
          >
            {value ? formatDisplay(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {daysInfo && (
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                daysInfo.isWarning
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-brand-500/15 text-brand-300 border-brand-500/30"
              }`}
            >
              {daysInfo.text}
            </span>
          )}

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

      {/* Floating Custom Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 z-50 w-[300px] sm:w-[330px] glass-modal rounded-2xl p-4 shadow-2xl shadow-black/90 border border-white/15 animate-dropdown backdrop-blur-2xl">
          {/* Quick Preset Buttons */}
          <div className="mb-3.5 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Quick Campaign Duration
              </span>
              <span className="text-[10px] text-brand-400 font-medium">
                Preset Timelines
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {presets.map((p) => {
                const targetDate = new Date(today.getTime() + p.days * 86400000);
                const targetStr = targetDate.toISOString().split("T")[0];
                const isSelected = value === targetStr;

                return (
                  <button
                    key={p.days}
                    type="button"
                    title={p.title}
                    onClick={() => handlePresetSelect(p.days)}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-md shadow-brand-600/40 ring-1 ring-white/20"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevYear}
                title="Previous Year"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
              >
                «
              </button>
              <h4 className="text-xs font-bold text-white tracking-wide">
                {monthNames[currentMonth]} {currentYear}
              </h4>
              <button
                type="button"
                onClick={handleNextYear}
                title="Next Year"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
              >
                »
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Next month"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {daysOfWeek.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={`empty-${i}`} className="h-8 w-8"></span>
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const thisDate = new Date(currentYear, currentMonth, dayNum);
              const isPast = thisDate < minimumDate;
              const formattedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isSelected = value === formattedDateStr;
              const isToday = isTodayDate(dayNum);

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDaySelect(dayNum)}
                  className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center font-medium transition-all relative cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-bold shadow-md shadow-brand-500/40 ring-2 ring-white/20 scale-105"
                      : isPast
                      ? "text-gray-600 cursor-not-allowed opacity-40"
                      : "text-gray-200 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-brand-400 absolute bottom-1"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Action Bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="truncate text-[10px] text-gray-400">
              {value ? (
                <span>
                  Target: <strong className="text-white">{formatDisplay(value)}</strong>
                </span>
              ) : (
                <span>No deadline selected</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2 py-1 rounded-lg text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
