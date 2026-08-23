'use client';

import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // একবার animate হলেই যথেষ্ট
        }
      },
      { threshold: 0.2 } // 👈 element এর 50% viewport এ ঢুকলে trigger হবে
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={visible ? 'animate-reveal' : 'opacity-0'}
    >
      {children}
    </div>
  );
}