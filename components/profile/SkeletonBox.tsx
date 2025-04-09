export default function SkeletonBox({ className = "" }: { className?: string }) {
    return (
      <div
        className={`animate-pulse rounded-md bg-muted ${className}`}
      />
    );
  }
  