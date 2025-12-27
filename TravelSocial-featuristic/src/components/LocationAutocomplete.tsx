import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export interface Location {
  name: string;
  lat: number;
  lon: number;
  type: string;
}

interface LocationAutocompleteProps {
  placeholder?: string;
  onLocationSelect?: (location: Location) => void;
  value?: string;
  className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  placeholder = "Enter city or location",
  onLocationSelect,
  value = "",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/locations?q=${encodeURIComponent(inputValue)}`);
        if (response.ok) {
          const locations = await response.json();
          setSuggestions(locations);
          setShowSuggestions(locations.length > 0);
          setSelectedIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimeout);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (location: Location) => {
    setInputValue(location.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onLocationSelect?.(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0 && inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-11 pr-12 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white placeholder-gray-400 transition-colors"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
          </div>
        )}
        {!isLoading && showSuggestions && (
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(location)}
              className={`w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-700 last:border-b-0 ${
                selectedIndex === index ? 'bg-zinc-800' : ''
              }`}
            >
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {location.name.split(',')[0]}
                  </div>
                  <div className="text-gray-400 text-xs truncate mt-1">
                    {location.name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;