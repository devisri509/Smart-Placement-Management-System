import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required ? <span className="text-rose-500"> *</span> : null}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`field-control ${error ? 'border-rose-400' : ''} ${Icon ? '!pl-11' : ''}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default Select;
