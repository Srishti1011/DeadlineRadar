import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = '#8B5CF6',
  badgeText,
  badgeType = 'neutral',
  onClick
}) => {
  const badgeClasses = {
    neutral: 'bg-[#F2EFF8] text-[#6D28D9] dark:bg-purple-950/40 dark:text-purple-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow card-hover transition-all
        ${onClick ? 'cursor-pointer hover:border-purple-300 dark:hover:border-purple-800' : ''}
      `}
    >
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#777780] dark:text-[#908FA0]">
          {title}
        </span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main oversized number */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17171D] dark:text-white font-mono">
          {value}
        </span>
        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              badgeClasses[badgeType] || badgeClasses.neutral
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Subtitle / context description */}
      {subtitle && (
        <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-2 line-clamp-1">
          {subtitle}
        </p>
      )}

      {/* Subtle bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-60"
        style={{
          background: `linear-gradient(90deg, ${accentColor}00, ${accentColor} 50%, ${accentColor}00)`
        }}
      />
    </div>
  );
};
