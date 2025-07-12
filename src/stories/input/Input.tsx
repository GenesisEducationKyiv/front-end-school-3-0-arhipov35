import React, { useState, useCallback } from 'react';
import './input.scss';
import errorIcon from '../../assets/icons/error.svg';

export interface InputProps {
  /**
   * Input label text
   */
  label?: string;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Default value for the input
   */
  defaultValue?: string;
  /**
   * Supporting text displayed below the input
   */
  supportingText?: string;
  /**
   * Whether the input is in error state
   */
  error?: boolean;
  /**
   * Whether to show the clear button
   */
  clearable?: boolean;
  /**
   * Callback when input value changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when input is cleared
   */
  onClear?: () => void;
}

/**
 * Input component for user text input
 */
export const Input = ({
  label,
  placeholder = '',
  defaultValue = '',
  supportingText,
  error = false,
  clearable = true,
  onChange,
  onClear,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const handleClear = useCallback(() => {
    setValue('');
    onClear?.();
    onChange?.('');
  }, [onChange, onClear]);

  return (
    <div className="input-container">
      {label && <label className={`input__label ${error ? 'input__label--error' : ''}`}>{label}</label>}
      <div className="input__wrapper">
        <input
          type="text"
          className={`input__field ${error ? 'input__field--error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <img 
            src={errorIcon} 
            alt="Error" 
            className="input__error-icon" 
          />
        )}
        {clearable && value && !error && (
          <button 
            className="input__clear-button"
            onClick={handleClear}
            type="button"
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
      {supportingText && (
        <div className={`input__supporting-text ${error ? 'input__supporting-text--error' : ''}`}>
          {supportingText}
        </div>
      )}
    </div>
  );
};
