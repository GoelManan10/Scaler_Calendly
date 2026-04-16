export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      {icon && <div className="text-5xl mb-4 opacity-40">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
}
