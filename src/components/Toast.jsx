// src/components/Toast.jsx
import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => {
        let Icon = Info;
        let iconColor = '#3b82f6';

        if (t.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--status-success)';
        } else if (t.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--status-error)';
        } else if (t.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'var(--status-warning)';
        }

        return (
          <div key={t.id} className={`toast-item toast-${t.type}`} role="alert">
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                padding: '2px'
              }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
