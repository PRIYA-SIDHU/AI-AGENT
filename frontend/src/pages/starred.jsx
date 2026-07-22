import React from 'react';
import { Sparkles } from 'lucide-react';
import SchemeCard from '../components/cards';

export default function StarredSchemesPage({ starredSchemes = [], onToggleStarredScheme }) {
  return (
    <div className="flex-1 overflow-y-auto bg-gov-bg px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400/80">
              Favourites
            </p>
            <h1 className="text-xl font-semibold text-slate-100">Starred Schemes</h1>
          </div>

          <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            {starredSchemes.length} saved
          </div>
        </div>

        {starredSchemes.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              No favourite schemes yet. Tap the star on any scheme card to save it here.
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {starredSchemes.map((scheme) => (
               <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  isStarred={true}
                  onToggleStarredScheme={onToggleStarredScheme}
               />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}