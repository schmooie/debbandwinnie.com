export default function InterestTag({ label }: { label: string }) {
  return (
    <span className="bg-brand-purple/30 text-brand-pink border border-brand-purple/50 rounded-full px-3 py-1 text-xs">
      {label}
    </span>
  )
}
