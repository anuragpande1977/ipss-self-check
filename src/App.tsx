
import React, { useMemo, useState } from 'react';
import { ENDPOINT } from './config';
import { ScoreBadge } from './components/ScoreBadge';
import { RadialScore } from './components/RadialScore';
import { QuestionCard } from './components/QuestionCard';

const QUESTIONS = [
  { key: 'q1', label: 'Incomplete emptying' },
  { key: 'q2', label: 'Frequency' },
  { key: 'q3', label: 'Intermittency' },
  { key: 'q4', label: 'Urgency' },
  { key: 'q5', label: 'Weak stream' },
  { key: 'q6', label: 'Straining' },
  { key: 'q7', label: 'Nocturia (times/night)' },
] as const;

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [qol, setQol] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);

  const total = useMemo(() => 
    QUESTIONS.reduce((acc, q) => acc + (answers[q.key] ?? 0), 0)
  , [answers]);

  const validEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validName = (val: string) => val.trim().length >= 2;

  const allAnswered = QUESTIONS.every((q) => typeof answers[q.key] === 'number');
  const canSubmit = validName(name) && validEmail(email) && consent && allAnswered && !loading;

  const onChangeAnswer = (key: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  // Capture UTM params to include in submission (optional)
  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_term: urlParams.get('utm_term') || '',
    utm_content: urlParams.get('utm_content') || '',
    page_url: window.location.href
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setServerError(null);
    setServerMsg(null);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    QUESTIONS.forEach((q) => formData.append(q.key, String(answers[q.key] ?? 0)));
    if (qol !== '') formData.append('qol', String(qol));
    Object.entries(utm).forEach(([k,v]) => formData.append(k, v as string));

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: formData });
      const out = await res.json();
      if (out.ok) {
        setServerMsg(`Thanks, ${name.split(' ')[0]}! Your IPSS total is ${out.total}.`);
        setSubmittedTotal(out.total ?? total);
      } else {
        setServerError(out.error || 'Submission failed.');
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-white to-white">
      <header className="mx-auto max-w-5xl px-4 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-sky-500/90 grid place-content-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/><path d="M7 13h3v8H7zM12 8h3v13h-3zM17 5h3v16h-3z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              IPSS Self-Assessment
            </h1>
            <p className="text-sm text-slate-500">by Anurag Pande</p>
          </div>
        </div>
        <p className="mt-4 text-slate-600 max-w-3xl">
          Take the quick IPSS self-assessment. Your responses are stored securely and help us
          understand real-world symptom patterns. Results are <em>not</em> a diagnosis—please consult a healthcare professional.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 card">
          <div className="card-header">
            <div className="card-title">IPSS Questionnaire</div>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm text-slate-700">
                    <UserIcon /> Name <span className="text-rose-500">*</span>
                  </label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm text-slate-700">
                    <MailIcon /> Email <span className="text-rose-500">*</span>
                  </label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"/>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <LockIcon /> We never share your email.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {QUESTIONS.map((q) => (
                  <QuestionCard
                    key={q.key}
                    label={q.label}
                    value={answers[q.key]}
                    onChange={(v) => setAnswers((prev) => ({ ...prev, [q.key]: v }))}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="qol" className="text-sm text-slate-700">Quality of Life (0–6, optional)</label>
                <input id="qol" type="number" min={0} max={6}
                      value={qol}
                      onChange={(e) => setQol(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0–6"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"/>
              </div>

              <div className="flex items-start gap-3">
                <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1"/>
                <label htmlFor="consent" className="text-sm text-slate-600">
                  I consent to share these responses for research and product improvement. I understand this is not medical advice.
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={!canSubmit}
                        className={`h-10 px-4 rounded-lg text-white transition ${
                          canSubmit ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300 cursor-not-allowed'
                        }`}>
                  {loading ? 'Submitting…' : 'Submit assessment'}
                </button>
                {!canSubmit && (
                  <p className="text-xs text-slate-500">Enter your name & a valid email, consent, and answer all items.</p>
                )}
              </div>

              {serverMsg && (
                <div className="mt-2 flex items-center gap-2 text-emerald-700 text-sm">
                  ✓ {serverMsg}
                </div>
              )}
              {serverError && (
                <div className="mt-2 flex items-center gap-2 text-rose-600 text-sm">
                  ⚠ {serverError}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title flex items-center gap-2">Live Score</div>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <RadialScore value={total} />
                <div>
                  <div className="text-5xl font-semibold text-slate-800">{total}</div>
                  <div className="mt-1"><ScoreBadge total={total} /></div>
                  <div className="mt-3 text-sm text-slate-600">International Prostate Symptom Score (0–35)</div>
                  <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                    <p className="mb-1"><strong>How to read your score</strong></p>
                    <ul className="list-disc ml-5">
                      <li>0–7: Mild</li>
                      <li>8–19: Moderate</li>
                      <li>20–35: Severe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Tips for Accurate Responses</div></div>
            <div className="card-content text-sm text-slate-600 space-y-2">
              <p>Answer based on the <strong>last month</strong>. If you’re unsure, pick the option that feels most typical for you.</p>
              <p>After you submit, we may contact you to discuss options and share educational resources.</p>
            </div>
          </div>

          {submittedTotal !== null && (
            <div className="card border-emerald-200">
              <div className="card-header"><div className="card-title">What your score suggests</div></div>
              <div className="card-content text-sm text-slate-700 space-y-2">
                <p>Your total score is <strong>{submittedTotal}</strong>. <ScoreBadge total={submittedTotal} /></p>
                <ul className="list-disc ml-5">
                  <li>Mild (0–7): lifestyle changes and monitoring may help.</li>
                  <li>Moderate (8–19): consider discussing options with a healthcare professional.</li>
                  <li>Severe (20–35): seek medical advice to evaluate therapies.</li>
                </ul>
                <p className="text-xs text-slate-500">This tool is informational and not a substitute for medical care.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-white/70">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Anurag Pande. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="#privacy">Privacy</a>
            <a className="hover:underline" href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
