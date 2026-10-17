/** A small success / error message. variant: 'success' | 'error' */
export default function Alert({ variant = 'success', children }) {
  const styles =
    variant === 'error'
      ? 'bg-red-500/5 text-red-500 border-red-500/20'
      : 'bg-green-500/5 text-green-500 border-green-500/20';
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-small ${styles}`}>
      {children}
    </div>
  );
}
