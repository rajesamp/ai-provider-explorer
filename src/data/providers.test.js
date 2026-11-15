import { describe, it, expect } from 'vitest';
import { providers, categories, categoryColors, stats } from './providers';

const REQUIRED = ['id', 'name', 'category', 'tagline', 'description', 'features', 'docs', 'website'];
const validCategoryIds = new Set(categories.filter((c) => c.id !== 'all').map((c) => c.id));

describe('provider dataset invariants', () => {
  it('stats.totalProviders matches the actual record count', () => {
    expect(stats.totalProviders).toBe(providers.length);
  });

  it('has a stable, non-zero number of providers', () => {
    expect(providers.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = providers.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique names', () => {
    const names = providers.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every provider has all required fields non-empty', () => {
    for (const p of providers) {
      for (const field of REQUIRED) {
        const v = p[field];
        const empty = v == null || v === '' || (Array.isArray(v) && v.length === 0);
        expect(empty, `${p.id || '(no id)'} missing "${field}"`).toBe(false);
      }
    }
  });

  it('every provider category is a declared category', () => {
    for (const p of providers) {
      expect(validCategoryIds.has(p.category), `${p.id} has unknown category "${p.category}"`).toBe(true);
    }
  });

  it('no declared category is empty', () => {
    for (const id of validCategoryIds) {
      expect(providers.some((p) => p.category === id), `category "${id}" has no providers`).toBe(true);
    }
  });

  it('categoryColors covers every declared category', () => {
    for (const id of validCategoryIds) {
      expect(categoryColors[id], `no color mapping for "${id}"`).toBeTruthy();
    }
  });

  it('docs and website are syntactically valid https URLs', () => {
    for (const p of providers) {
      for (const key of ['docs', 'website']) {
        const url = new URL(p[key]);
        expect(['http:', 'https:']).toContain(url.protocol);
      }
    }
  });

  it('stats.byCategory sums to the total', () => {
    const sum = Object.values(stats.byCategory).reduce((a, b) => a + b, 0);
    expect(sum).toBe(providers.length);
  });
});
