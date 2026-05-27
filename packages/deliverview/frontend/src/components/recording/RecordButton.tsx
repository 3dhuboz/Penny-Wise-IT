interface RecordButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ onClick, disabled }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="h-12 w-12 rounded-full bg-white" />
      <span className="absolute -bottom-8 text-sm font-medium text-slate-600">
        Start Recording
      </span>
    </button>
  );
}
