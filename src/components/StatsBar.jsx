import { motion } from 'framer-motion';
import { Activity, Layers, Cpu, Globe } from 'lucide-react';

export default function StatsBar({ total, filtered, categories }) {
  const stats = [
    { icon: Layers, label: 'Providers', value: total, color: 'text-blue-400' },
    { icon: Cpu, label: 'Categories', value: categories, color: 'text-purple-400' },
    { icon: Globe, label: 'Filtered', value: filtered, color: 'text-cyan-400' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2 text-sm">
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
          <span className="text-slate-500">{stat.label}</span>
          <span className="font-mono font-semibold text-slate-200">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
