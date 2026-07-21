import React, { useEffect, useState } from 'react';
import { LoaderCircle, AlertCircle, ExternalLink, BadgeCheck, FileText, Sparkles } from 'lucide-react';

export default function EligibleschemesPage() {
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
            <article
              key={scheme.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
                    {scheme.category || 'Scheme'}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-100">
                    {scheme.name}
                  </h2>
                </div>

                <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  {scheme.id}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {scheme.description}
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Eligibility
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {scheme.eligibility}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Benefits
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {scheme.benefits}
                  </p>
                </div>

                {scheme.required_documents?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Required Documents
                    </p>
                    <ul className="mt-2 space-y-1">
                      {scheme.required_documents.map((doc, index) => (
                        <li
                          key={`${scheme.id}-${index}`}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {scheme.official_link && (
                <a
                  href={scheme.official_link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4" />
                  Open official link
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}