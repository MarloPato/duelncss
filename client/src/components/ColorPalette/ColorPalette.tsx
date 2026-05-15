import { useToast } from '../../hooks/useToast';
import './ColorPalette.css';

interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const toast = useToast();

  if (!colors || colors.length === 0) return null;

  const handleCopy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      toast(`Copied ${hex}`);
    } catch {
      toast('Failed to copy');
    }
  };

  return (
    <div className="palette">
      {colors.map((hex) => (
        <button
          key={hex}
          className="palette-pill"
          onClick={() => handleCopy(hex)}
          title={`Copy ${hex}`}
        >
          <span className="palette-dot" style={{ background: hex }} />
          <span className="palette-hex">{hex}</span>
        </button>
      ))}
    </div>
  );
}
