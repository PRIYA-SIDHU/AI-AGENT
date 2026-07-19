import React, { useState, useEffect } from 'react';
import { Pencil, FilePlus, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const BLANK = {
  first_name: '', surname: '', email: '', dob: '', gender: '', mobile: '',
  address: '', state: '', highest_education: '', twelfth_passed: 'Yes',
  twelfth_board: '', twelfth_percentage: '', tenth_passed: 'Yes',
  tenth_board: '', tenth_percentage: '', category: '', physically_challenged: '',
  nationality: '', occupation: '',
};

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'];
const EDUCATIONS = ['10th','12th','Diploma','Graduation','Post Graduation','PhD','Other'];
const CATEGORIES = ['General','OBC','SC','ST','EWS'];
const CHALLENGED = ['No','Yes – Locomotor','Yes – Visual','Yes – Hearing','Yes – Other'];
const NATIONALITIES = ['Indian','NRI','OCI','Foreigner'];
const OCCUPATIONS = ['Student','Employed','Self-Employed','Unemployed','Farmer','Other'];

// Reusable field components
const Label = ({ children }) => (
  <label className="block text-xs font-medium text-slate-400 mb-1">{children}</label>
);

const Input = ({ ...props }) => (
  <input
    className="w-full bg-slate-900/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  />
);

const Select = ({ children, ...props }) => (
  <select
    className="w-full bg-slate-900/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
    {...props}
  >
    {children}
  </select>
);

const SectionTitle = ({ color, children }) => (
  <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${color}`}>{children}</h2>
);

const RadioGroup = ({ name, value, onChange, disabled }) => (
  <div className="flex items-center gap-4 mt-1">
    {['Yes', 'No'].map(opt => (
      <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-300 cursor-pointer">
        <input
          type="radio" name={name} value={opt}
          checked={value === opt} onChange={onChange}
          disabled={disabled}
          className="accent-cyan-500"
        />
        {opt}
      </label>
    ))}
  </div>
);

export default function Profile({ onProfileSaved }) {
  const [form, setForm] = useState(BLANK);
  const [readOnly, setReadOnly] = useState(true);
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.first_name) {
          setForm({ ...BLANK, ...data });
          setHasProfile(true);
          setReadOnly(true);
        } else {
          setReadOnly(false);
        }
      })
      .catch(() => setReadOnly(false));
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:8000/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setHasProfile(true);
        setReadOnly(true);
        onProfileSaved?.(form);
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleNew = () => {
    setForm(BLANK);
    setReadOnly(false);
    setStatus(null);
    setHasProfile(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
    setStatus(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gov-bg px-4 py-6 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
            My Profile &amp; Application
          </h1>
          <div className="flex items-center gap-2">
            {hasProfile && readOnly && (
              <button onClick={handleEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 border border-cyan-500/40 rounded-lg hover:bg-cyan-950/30 transition-all">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button onClick={handleNew}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all">
              <FilePlus className="w-3.5 h-3.5" /> New
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-8">

          {/* ── PERSONAL DETAILS ── */}
          <section>
            <SectionTitle color="text-cyan-400">Personal Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input required placeholder="Priya" value={form.first_name} onChange={set('first_name')} disabled={readOnly} />
              </div>
              <div>
                <Label>Surname *</Label>
                <Input required placeholder="Sidhu" value={form.surname} onChange={set('surname')} disabled={readOnly} />
              </div>
              <div>
                <Label>Email Address *</Label>
                <Input required type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} disabled={readOnly} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={form.dob} onChange={set('dob')} disabled={readOnly} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onChange={set('gender')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {['Male','Female','Transgender','Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                </Select>
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input type="tel" placeholder="9876543210" maxLength={10} value={form.mobile} onChange={set('mobile')} disabled={readOnly} />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input placeholder="House No., Street, City" value={form.address} onChange={set('address')} disabled={readOnly} />
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onChange={set('state')} disabled={readOnly}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </Select>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-800" />

          {/* ── EDUCATIONAL DETAILS ── */}
          <section>
            <SectionTitle color="text-emerald-400">Educational Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Highest Education</Label>
                <Select value={form.highest_education} onChange={set('highest_education')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {EDUCATIONS.map(e => <option key={e}>{e}</option>)}
                </Select>
              </div>
              <div>
                <Label>12th Passed?</Label>
                <RadioGroup name="twelfth_passed" value={form.twelfth_passed} onChange={set('twelfth_passed')} disabled={readOnly} />
              </div>
              <div>
                <Label>12th Board</Label>
                <Input placeholder="CBSE / ICSE / State" value={form.twelfth_board} onChange={set('twelfth_board')} disabled={readOnly} />
              </div>
              <div>
                <Label>12th Percentage / CGPA</Label>
                <Input placeholder="e.g. 85.4" value={form.twelfth_percentage} onChange={set('twelfth_percentage')} disabled={readOnly} />
              </div>
              <div>
                <Label>10th Passed?</Label>
                <RadioGroup name="tenth_passed" value={form.tenth_passed} onChange={set('tenth_passed')} disabled={readOnly} />
              </div>
              <div>
                <Label>10th Board</Label>
                <Input placeholder="CBSE / ICSE / State" value={form.tenth_board} onChange={set('tenth_board')} disabled={readOnly} />
              </div>
              <div>
                <Label>10th Percentage / CGPA</Label>
                <Input placeholder="e.g. 90.2" value={form.tenth_percentage} onChange={set('tenth_percentage')} disabled={readOnly} />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-800" />

          {/* ── CATEGORY & OTHER ── */}
          <section>
            <SectionTitle color="text-orange-400">Category &amp; Other Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onChange={set('category')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>Physically Challenged?</Label>
                <Select value={form.physically_challenged} onChange={set('physically_challenged')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {CHALLENGED.map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>Nationality</Label>
                <Select value={form.nationality} onChange={set('nationality')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                </Select>
              </div>
              <div>
                <Label>Occupation</Label>
                <Select value={form.occupation} onChange={set('occupation')} disabled={readOnly}>
                  <option value="">Select...</option>
                  {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
                </Select>
              </div>
            </div>
          </section>

          {/* ── STATUS BANNER ── */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-950/30 border border-emerald-500/30 rounded-lg px-4 py-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> Profile saved successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 border border-red-500/30 rounded-lg px-4 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> Failed to save. Please try again.
            </div>
          )}

          {/* ── SUBMIT BUTTON ── */}
          {!readOnly && (
            <button type="submit" disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg shadow-cyan-900/30 disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'loading'
                ? <><Loader className="w-4 h-4 animate-spin" /> Submitting...</>
                : <><Send className="w-4 h-4" /> Submit Application</>}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
