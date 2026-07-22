import React from 'react';
import { Star, ExternalLink, BadgeCheck, FileText } from 'lucide-react';

export default function SchemeCard({ scheme, isStarred = false, onToggleStarredScheme }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
            {scheme.category || 'Scheme'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">
            {scheme.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleStarredScheme?.(scheme)}
            className={`rounded-full border p-2 transition ${
              isStarred
                ? 'border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'border-slate-700 bg-slate-800/70 text-slate-400 hover:border-amber-400/40 hover:text-amber-300'
            }`}
            aria-label={
              isStarred
                ? `Remove ${scheme.name} from favourites`
                : `Add ${scheme.name} to favourites`
            }
          >
            <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
          </button>

          <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            {scheme.id}
          </div>
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
  );
}