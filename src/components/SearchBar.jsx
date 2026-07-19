import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search 70+ AI providers..."
        className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 text-sm font-sans"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
