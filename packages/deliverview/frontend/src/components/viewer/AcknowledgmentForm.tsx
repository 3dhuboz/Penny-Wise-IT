import { useState } from 'react';
import { SignaturePad } from './SignaturePad';
import { Button } from '../ui/Button';

interface AcknowledgmentFormProps {
  handoverTitle: string;
  onSubmit: (data: { client_name: string; client_email: string; consent_text: string; signature_data?: string }) => Promise<void>;
  disabled?: boolean;
}

const CONSENT_ITEMS = [
  'I have watched all sections of this handover',
  'I understand the website functionality demonstrated',
  'I accept delivery of the website as demonstrated',
  'Any issues not raised within 14 business days of this acknowledgment will be considered accepted',
];

export function AcknowledgmentForm({ handoverTitle, onSubmit, disabled }: AcknowledgmentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checks, setChecks] = useState<boolean[]>(CONSENT_ITEMS.map(() => false));
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = checks.every(Boolean);
  const canSubmit = name && email && allChecked && !disabled;

  const toggleCheck = (i: number) => {
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const consentText = `I, ${name || '[Full Name]'}, confirm that I have reviewed the website handover titled "${handoverTitle}" delivered by Penny Wise I.T. on ${new Date().toLocaleDateString()}.\n\nI acknowledge that:\n${CONSENT_ITEMS.map((item, i) => `${checks[i] ? '[x]' : '[ ]'} ${item}`).join('\n')}`;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        client_name: name,
        client_email: email,
        consent_text: consentText,
        signature_data: signature ?? undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-slate-800">Handover Acknowledgment</h2>
      <p className="mb-6 text-sm text-slate-500">
        Please confirm you have reviewed the handover and accept delivery.
      </p>

      <div className="space-y-4">
        {/* Consent checkboxes */}
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            I, <strong>{name || '________'}</strong>, confirm that I have reviewed the website handover titled
            "<strong>{handoverTitle}</strong>" delivered by Penny Wise I.T.
          </p>
          <p className="text-sm font-medium text-slate-700">I acknowledge that:</p>
          {CONSENT_ITEMS.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggleCheck(i)}
                className="mt-0.5 rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">{item}</span>
            </label>
          ))}
        </div>

        {/* Name + Email */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Signature */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Signature</label>
          <SignaturePad onSignature={setSignature} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleSubmit} disabled={!canSubmit || submitting} size="lg" className="w-full">
          {submitting ? 'Submitting...' : 'Submit Acknowledgment'}
        </Button>

        <p className="text-center text-xs text-slate-400">
          This acknowledgment is digitally recorded with your IP address, browser details, and timestamp.
        </p>
      </div>
    </div>
  );
}
