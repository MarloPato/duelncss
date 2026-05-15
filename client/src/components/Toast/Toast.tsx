interface ToastProps {
  message: string;
  type: string;
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div className={`toast toast--${type}`}>
      {message}
    </div>
  );
}
