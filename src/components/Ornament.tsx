type OrnamentProps = {
  className?: string;
  light?: boolean;
};

export function Ornament({ className = "", light = false }: OrnamentProps) {
  return (
    <div
      className={`ornament ${light ? "opacity-80" : ""} ${className}`}
      aria-hidden="true"
    >
      <span className="ornament-diamond" />
    </div>
  );
}
