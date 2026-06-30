"use client";

interface Props {
  open: boolean;
  onReturn: () => void;
  onSubmit: () => void;
}

export default function WarningModal({ open, onReturn, onSubmit }: Props) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
    >
      <div
        className="
        bg-white
        dark:bg-zinc-900
        rounded-2xl
        p-8
        max-w-md
        w-full
      "
      >
        <h2 className="text-2xl font-bold text-red-600">Warning</h2>

        <p className="mt-4">You exited fullscreen mode.</p>

        <p className="mt-2">Return to fullscreen to continue the assessment.</p>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onReturn}
            className="
            flex-1
            bg-blue-600
            text-white
            py-2
            rounded-lg
          "
          >
            Return
          </button>

          <button
            onClick={onSubmit}
            className="
            flex-1
            bg-red-600
            text-white
            py-2
            rounded-lg
          "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
