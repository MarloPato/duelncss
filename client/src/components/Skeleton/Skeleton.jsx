import './Skeleton.css';

export default function Skeleton({ width, height, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
    />
  );
}
