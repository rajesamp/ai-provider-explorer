import { categories } from '../data/providers';
import {
  Grid3X3, FlaskConical, Cloud, GitBranch, Zap, Terminal, Shield, Gift, Target
} from 'lucide-react';

const iconMap = {
  Grid3X3, FlaskConical, Cloud, GitBranch, Zap, Terminal, Shield, Gift, Target
};

const colorMap = {
  blue: 'hover:border-blue-500/40 hover:text-blue-300',
  purple: 'hover:border-purple-500/40 hover:text-purple-300',
  cyan: 'hover:border-cyan-500/40 hover:text-cyan-300',
  emerald: 'hover:border-emerald-500/40 hover:text-emerald-300',
  amber: 'hover:border-amber-500/40 hover:text-amber-300',
  rose: 'hover:border-rose-500/40 hover:text-rose-300',
  indigo: 'hover:border-indigo-500/40 hover:text-indigo-300',
};

const activeColorMap = {
  blue: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  purple: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
  cyan: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
  emerald: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  rose: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
  indigo: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
};

export default function CategoryFilter({ active, onChange, counts }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon];
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              border transition-all duration-200 cursor-pointer
              ${isActive
                ? activeColorMap[cat.color]
                : `bg-white/[0.03] border-white/[0.06] text-slate-400 ${colorMap[cat.color]}`
              }
            `}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{cat.label}</span>
            {counts[cat.id] !== undefined && (
              <span className={`text-xs ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                {counts[cat.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
