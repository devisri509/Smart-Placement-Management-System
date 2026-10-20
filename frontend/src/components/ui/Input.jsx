import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  endIcon: EndIcon,
  onEndIconClick,
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
        <input
          id={name}
          type={type}
          name={name}
          value={value !== undefined && value !== null ? value : ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`field-control ${error ? 'border-rose-400' : ''} ${Icon ? '!pl-11' : ''} ${EndIcon ? '!pr-11' : ''}`}
          {...props}
        />
        {EndIcon && (
          <button
            type="button"
            onClick={onEndIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            tabIndex={-1}
          >
            <EndIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default Input;
