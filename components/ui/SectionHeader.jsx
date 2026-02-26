export default function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}
