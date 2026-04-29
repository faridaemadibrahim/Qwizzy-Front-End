export default function DifficultyBadge({ level }) {
  return (
    <span className={`badge-difficulty badge-${level}`}>
      {level}
    </span>
  );
}