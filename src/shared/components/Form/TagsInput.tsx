import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    const filtered = suggestions.filter(
      suggestion => 
        suggestion.toLowerCase().includes(input.toLowerCase()) && 
        !tags.includes(suggestion)
    );
    setFilteredSuggestions(filtered);
    setIsDropdownOpen(input.length > 0 && filtered.length > 0);
  }, [input, suggestions, tags]);

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

  const addTag = (tag: string) => {
    if (disabled) return;
    
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      onChange(newTags);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      const lastTag = tags[tags.length - 1];
      if (lastTag) {
        removeTag(lastTag);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`tags-input-container ${error ? 'is-invalid' : ''}`}
      {...divProps}  
    >
      <div className="tags-input-wrapper">
        <div className="tags-list">
          {tags.map((tag, index) => (
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
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="tag-input"
            disabled={disabled}
          />
        </div>
        {isDropdownOpen && (
          <div ref={dropdownRef} className="tags-suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};


export default TagsInput;
