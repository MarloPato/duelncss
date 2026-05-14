import { useToast } from '../../hooks/useToast';
import './ColorPalette.css';

export default function ColorPalette({ colors }) {
  const toast = useToast();

  if (!colors || colors.length === 0) return null;

  const handleCopy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      toast(`Copied ${hex}`, 'success', 2000);
    } catch {
      toast('Failed to copy', 'error');
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
