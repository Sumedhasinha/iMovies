// src/components/SearchBar.jsx
import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by title, director, actor, or genre...'
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '1.1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '2.8rem',
          paddingRight: value ? '2.5rem' : '1rem',
          height: '46px',
          fontSize: '0.95rem',
          background: 'rgba(20, 24, 34, 0.75)',
          backdropFilter: 'blur(10px)',
          borderColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}
        aria-label="Search movies"
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search text"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
