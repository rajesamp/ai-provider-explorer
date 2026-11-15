import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, Tag, Box, DollarSign } from 'lucide-react';
import { categoryColors } from '../data/providers';

export default function ProviderCard({ provider, index }) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[provider.category] || categoryColors.specialist;
  const titleId = `provider-${provider.id}-title`;
  const panelId = `provider-${provider.id}-panel`;
  const toggle = () => setExpanded((e) => !e);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`
        glass-card rounded-2xl overflow-hidden cursor-pointer group
        ${expanded ? colors.glow : ''}
      `}
      onClick={toggle}
    >
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <h3 id={titleId} className="text-base font-semibold text-white truncate">
                {provider.name}
              </h3>
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider shrink-0
                ${colors.bg} ${colors.border} ${colors.text} border
              `}>
                {provider.category}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
              {provider.tagline}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggle(); }}
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} details for ${provider.name}`}
            className="ml-3 shrink-0 text-slate-400 group-hover:text-slate-300 transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="h-5 w-5" aria-hidden="true" /> : <ChevronDown className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {provider.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]"
            >
              {f}
            </span>
          ))}
          {provider.features.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
              +{provider.features.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={titleId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/[0.05]">
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {provider.description}
              </p>

              {/* All features */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Features</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {provider.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Models */}
              {provider.models && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Box className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Models</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.models.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/[0.03] text-slate-300 border border-white/[0.05]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {provider.pricing && (
                <div className="flex items-center gap-1.5 mb-4">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pricing:</span>
                  <span className="text-xs text-slate-300">{provider.pricing}</span>
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-3">
                <a
                  href={provider.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  Docs
                  <span className="sr-only"> for {provider.name} (opens in new tab)</span>
                </a>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  Website
                  <span className="sr-only"> for {provider.name} (opens in new tab)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
