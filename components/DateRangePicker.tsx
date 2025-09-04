'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Props = {
  initialFrom?: string;
  initialTo?: string;
  className?: string;
};

export default function DateRangePicker({ initialFrom, initialTo, className }: Props) {
  const [from, setFrom] = useState(initialFrom ?? '');
  const [to, setTo] = useState(initialTo ?? '');
  const router = useRouter();
  const searchParams = useSearchParams();

  const apply = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('range', 'dates');
    from ? sp.set('from', from) : sp.delete('from');
    to ? sp.set('to', to) : sp.delete('to');
    router.replace(`/events?${sp.toString()}`);
  };

  const clear = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('range', 'dates');
    sp.delete('from');
    sp.delete('to');
    router.replace(`/events?${sp.toString()}`);
    setFrom('');
    setTo('');
  };

  return (
    <div className={`mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end ${className ?? ''}`}>
      <label className="text-sm">
        From
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="ml-2 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none focus:ring-white/30"
        />
      </label>
      <label className="text-sm">
        To
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="ml-2 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none focus:ring-white/30"
        />
      </label>

      <div className="flex gap-2">
        <button
          onClick={apply}
          className="rounded-md bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
        >
          Apply
        </button>
        <button
          onClick={clear}
          className="rounded-md bg-white/5 px-3 py-2 text-sm text-white/70 ring-1 ring-white/10 hover:bg-white/10"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
