import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import "@/styles/tags-input.scss";

interface TagsInputProps {
  tags: string[];
  suggestions?: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  suggestions = [],
  onChange,
  placeholder = 'Add a tag...',
  disabled = false,
  error,
  ...divProps 
}) => {
  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return suggestions.filter(
      suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase()) && 
        !tags.includes(suggestion)
    );
  }, [input, suggestions, tags]);
  
  useEffect(() => {
    setFilteredSuggestions(filtered);
    setIsDropdownOpen(input.length > 0 && filtered.length > 0);
  }, [filtered, input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addTag = useCallback((tag: string) => {
    if (disabled) return;
    
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      onChange(newTags);
      setInput('');
      inputRef.current?.focus();
    }
  }, [disabled, tags, onChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    if (disabled) return;
    
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  }, [disabled, tags, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        removeTag(lastTag);
      }
    }
  }, [input, tags, addTag, removeTag]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    addTag(suggestion);
    setIsDropdownOpen(false);
  }, [addTag]);

  const renderedTags = useMemo(() => {
    return tags.map((tag, index) => (
      <div key={index} className="tag-item">
        <span className="tag-text">{tag}</span>
        {!disabled && (
          <button
            type="button"
            className="tag-remove-btn"
            onClick={() => removeTag(tag)}
          >
            &times;
          </button>
        )}
      </div>
    ));
  }, [tags, disabled, removeTag]);

  const renderedSuggestions = useMemo(() => {
    return filteredSuggestions.map((suggestion, index) => (
      <div
        key={index}
        className="suggestion-item"
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </div>
    ));
  }, [filteredSuggestions, handleSuggestionClick]);

  const inputPlaceholder = useMemo(() => {
    return tags.length === 0 ? placeholder : '';
  }, [tags.length, placeholder]);

  return (
    <div
      className={`tags-input-container ${error ? 'is-invalid' : ''}`}
      {...divProps}  
    >
      <div className="tags-input-wrapper">
        <div className="tags-list">
          {renderedTags}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={inputPlaceholder}
            className="tag-input"
            disabled={disabled}
          />
        </div>
        {isDropdownOpen && (
          <div ref={dropdownRef} className="tags-suggestions">
            {renderedSuggestions}
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};


export default TagsInput;
