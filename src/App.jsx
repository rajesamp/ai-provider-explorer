import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ProviderCard from './components/ProviderCard';
import StatsBar from './components/StatsBar';
import { providers, categories, stats } from './data/providers';

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const counts = useMemo(() => {
    const c = { all: providers.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        c[cat.id] = providers.filter((p) => p.category === cat.id).length;
      }
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    let result = providers;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q)) ||
          p.models?.some((m) => m.toLowerCase().includes(q))
      );
    }

    return result;
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative pt-12 pb-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-400 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Source: OpenCode Provider Registry + Curated Data</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">AI Provider</span>{' '}
            <span className="gradient-text">Explorer</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
            {stats.totalProviders} providers across {categories.length - 1} categories.
            <br className="hidden sm:block" />
            Pick, compare, and connect to the right LLM backend.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <StatsBar
              total={stats.totalProviders}
              filtered={filtered.length}
              categories={categories.length - 1}
            />
          </motion.div>
        </motion.div>
      </header>

      {/* Search + Filters */}
      <section className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>
      </section>

      {/* Provider Grid */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-mono text-slate-300">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'provider' : 'providers'}
              {activeCategory !== 'all' && (
                <span>
                  {' '}in{' '}
                  <span className="text-slate-300">
                    {categories.find((c) => c.id === activeCategory)?.label}
                  </span>
                </span>
              )}
              {search && (
                <span>
                  {' '}matching{' '}
                  <span className="text-slate-300">"{search}"</span>
                </span>
              )}
            </p>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((provider, i) => (
                <ProviderCard key={provider.id} provider={provider} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No providers found</h3>
              <p className="text-slate-500">Try a different search term or category.</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Built from</span>
            <a
              href="https://opencode.ai/docs/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              OpenCode Provider Registry
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>{stats.totalProviders} providers</span>
            <span>·</span>
            <span>{categories.length - 1} categories</span>
            <span>·</span>
            <span>Updated July 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
