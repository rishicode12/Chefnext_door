import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewsTab = ({ provider }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filterOptions = [
    { value: 'all', label: 'All Reviews', count: provider.reviews.length },
    { value: '5', label: '5 Stars', count: provider.reviews.filter(r => r.rating === 5).length },
    { value: '4', label: '4 Stars', count: provider.reviews.filter(r => r.rating === 4).length },
    { value: '3', label: '3 Stars', count: provider.reviews.filter(r => r.rating === 3).length },
    { value: 'photos', label: 'With Photos', count: provider.reviews.filter(r => r.photos?.length > 0).length },
  ];

  const filteredReviews = provider.reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'photos') return review.photos?.length > 0;
    return review.rating === parseInt(selectedFilter);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="text-4xl font-bold text-foreground mb-2">{provider.rating}</div>
            <div className="flex items-center justify-center lg:justify-start space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={`${
                    i < Math.floor(provider.rating)
                      ? 'text-warning fill-current' :'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{provider.reviewCount} total reviews</p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = provider.reviews.filter(r => r.rating === stars).length;
              const percentage = (count / provider.reviews.length) * 100;
              
              return (
                <div key={stars} className="flex items-center space-x-3 mb-2">
                  <span className="text-sm text-muted-foreground w-8">{stars}</span>
                  <Icon name="Star" size={14} className="text-warning" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedFilter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{review.customerName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={`${
                              i < review.rating
                                ? 'text-warning fill-current' :'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                  
                  {review.verified && (
                    <div className="flex items-center space-x-1 text-success text-sm mt-2 sm:mt-0">
                      <Icon name="CheckCircle" size={14} />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Service: {review.serviceType}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex space-x-2 mb-4 overflow-x-auto">
                    {review.photos.map((photo, index) => (
                      <div key={index} className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Provider Response */}
                {review.providerResponse && (
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="MessageCircle" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">Response from {provider.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.providerResponse}
                    </p>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center space-x-4 mt-4 text-sm">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Flag" size={14} />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredReviews.length < provider.reviews.length && (
        <div className="text-center">
          <Button variant="outline" iconName="ChevronDown" iconPosition="right">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;