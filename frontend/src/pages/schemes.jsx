import React, { useEffect, useState } from 'react';
import { LoaderCircle, AlertCircle } from 'lucide-react';
import SchemeCard from '../components/Cards';

export default function SchemesPage({ starredSchemeIds = [], onToggleStarredScheme }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const res = await fetch('http://localhost:8000/schemes');
        if (!res.ok) throw new Error('Unable to load schemes from FastAPI');
        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gov-bg px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400/80">
              Government Schemes
            </p>
            <h1 className="text-xl font-semibold text-slate-100">All Schemes</h1>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {schemes.length} available
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading schemes from FastAPI...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {!loading && !error && schemes.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-6 text-sm text-slate-400">
            No schemes found.
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schemes.map((scheme) => (
  <SchemeCard
    key={scheme.id}
    scheme={scheme}
    isStarred={starredSchemeIds.includes(scheme.id)}
    onToggleStarredScheme={onToggleStarredScheme}
  />
))}
        </div>
      </div>
    </div>
  );
}