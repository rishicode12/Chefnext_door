import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onFilterToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const popularSearches = [
    'Margherita Pizza',
    'Chicken Manchurian',
    'Masala Dosa',
    'Paneer Tikka',
    'Chocolate Cake'
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLocationExpanded(!isLocationExpanded)}
            className="flex items-center space-x-2 px-4 py-3"
          >
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="hidden sm:inline">Delhi</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onFilterToggle}
            className="p-3"
          >
            <Icon name="SlidersHorizontal" size={16} />
          </Button>

          <Button type="submit" className="px-6 py-3">
            Search
          </Button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Popular dishes:</p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(search);
                onSearch(search);
              }}
              className="text-sm bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1 rounded-full transition-colors duration-200"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Location Expansion */}
      {isLocationExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Service Area</h4>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span>Currently serving: Delhi, IN (5 mile radius)</span>
          </div>
          <Button variant="ghost" className="mt-2 text-sm">
            Change Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;