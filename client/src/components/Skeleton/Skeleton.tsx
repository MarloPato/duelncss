import { type CSSProperties } from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width: string | number;
  height: string | number;
  style?: CSSProperties;
}

export default function Skeleton({ width, height, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
    />
  );
}
