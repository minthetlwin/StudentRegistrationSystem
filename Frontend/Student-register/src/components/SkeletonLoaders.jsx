import React from 'react';

/**
 * Reusable skeleton shimmer block.
 * Accepts className for custom width/height/rounding.
 */
export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`skeleton-shimmer ${className}`} />
  );
}

/**
 * Skeleton for a single table/list row (student card style).
 */
export function SkeletonRow() {
  return (
    <div className="flex items-center space-x-4 p-5 border-b border-slate-50 animate-pulse">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded-lg w-2/5" />
        <div className="h-3 bg-slate-100 rounded-lg w-3/5" />
      </div>
      {/* Badge placeholder */}
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for a list of student rows. Renders `count` skeleton rows.
 */
export function SkeletonStudentList({ count = 5 }) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* Header skeleton */}
      <div className="p-8 border-b border-slate-100 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded-lg w-56" />
            <div className="h-3 bg-slate-100 rounded-lg w-72" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-slate-200 rounded-xl" />
            <div className="h-10 w-36 bg-slate-200 rounded-xl" />
          </div>
        </div>
        {/* Tab skeleton */}
        <div className="flex space-x-6 mt-10">
          <div className="h-8 w-36 bg-slate-200 rounded-lg" />
          <div className="h-8 w-40 bg-slate-100 rounded-lg" />
        </div>
      </div>
      {/* Row skeletons */}
      <div className="p-6">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for a card-style component (Payment, Dorm form, etc).
 */
export function SkeletonCard() {
  return (
    <div className="glass-card shadow-lg w-full max-w-lg mx-auto p-8 rounded-3xl animate-pulse space-y-6">
      {/* Icon circle */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-200" />
      </div>
      {/* Title */}
      <div className="flex justify-center">
        <div className="h-6 bg-slate-200 rounded-lg w-48" />
      </div>
      {/* Subtitle */}
      <div className="flex justify-center">
        <div className="h-4 bg-slate-100 rounded-lg w-64" />
      </div>
      {/* Receipt/content area */}
      <div className="space-y-4 pt-4">
        <div className="h-32 bg-slate-100 rounded-xl w-full" />
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
      </div>
      {/* Button placeholder */}
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}

/**
 * Full-page skeleton with sidebar placeholder (for Dashboard initial load).
 */
export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-[280px] bg-white border-r border-slate-200 animate-pulse">
        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-100 rounded w-16" />
            </div>
          </div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        </div>
      </div>
      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 animate-pulse flex items-center px-6">
          <div className="h-5 bg-slate-200 rounded w-32" />
        </div>
        {/* Content */}
        <div className="p-8">
          <SkeletonStudentList count={4} />
        </div>
      </div>
    </div>
  );
}
