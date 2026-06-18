'use client';

import { useEffect, useState } from 'react';

const EXAMPLES = [
  'yourname.is-a.software',
  'foo.is-a.software',
  'devprofiles.is-a.software',
  'yourapp.is-a.software',
  'demo.is-a.software',
  'glasschat.is-a.software',
  'papermarket.is-a.software',
  'something.is-a.software',
  'weatherapp.is-a.software',
  'lfg.is-a.software',
];

export default function Typewriter() {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = EXAMPLES[idx];
    let timeout;

    if (!isDeleting) {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 35);
      } else {
        setIsDeleting(false);
        setIdx((idx + 1) % EXAMPLES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, idx, isDeleting]);

  return (
    <span className="font-mono">
      {text}<span className="animate-pulse text-slate-500">|</span>
    </span>
  );
}
