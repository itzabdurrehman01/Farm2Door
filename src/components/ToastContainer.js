import { useToast } from '../state/ToastContext';

function ToastContainer() {
  const { toasts } = useToast() || { toasts: [] };
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

