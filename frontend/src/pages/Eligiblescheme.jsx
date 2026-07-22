import React, { useEffect, useState } from 'react';
import { LoaderCircle, AlertCircle, Sparkles } from 'lucide-react';
import SchemeCard from '../components/Cards';

export default function EligibleschemesPage({ starredSchemeIds = [], onToggleStarredScheme }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEligibleSchemes = async () => {
      try {
        const res = await fetch('http://localhost:8000/eligibleschemes');
        if (!res.ok) throw new Error('Unable to load eligible schemes from FastAPI');

        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadEligibleSchemes();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gov-bg px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400/80">
              Eligible Schemes
            </p>
            <h1 className="text-xl font-semibold text-slate-100">Schemes for Your Profile</h1>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {schemes.length} matched
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Checking your profile against available schemes...
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
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              No eligible schemes were found for your saved profile yet. Complete your profile details and try again.
            </div>
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