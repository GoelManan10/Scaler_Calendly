export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 rounded-full border-[3px] border-border-light" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-text-tertiary text-sm">{text}</p>
    </div>
  );
}
