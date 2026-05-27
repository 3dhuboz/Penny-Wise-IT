import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 p-16 text-center">
      <SettingsIcon className="h-12 w-12 text-slate-300" />
      <h2 className="text-lg font-semibold text-slate-600">Settings</h2>
      <p className="text-sm text-slate-400">
        Organization settings and preferences — coming in Phase 5.
      </p>
    </div>
  );
}
