import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProviderHero = ({ provider, onShare, onFavorite, isFavorited }) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Mobile Header Actions */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Button variant="ghost" className="p-2">
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={onShare} className="p-2">
              <Icon name="Share2" size={20} />
            </Button>
            <Button 
              variant="ghost" 
              onClick={onFavorite}
              className={`p-2 ${isFavorited ? 'text-destructive' : ''}`}
            >
              <Icon name={isFavorited ? "Heart" : "Heart"} size={20} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Provider Image */}
          <div className="relative mb-6 lg:mb-0 lg:flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 rounded-full overflow-hidden bg-muted">
              {imageLoading && (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" size={48} className="text-muted-foreground" />
                </div>
              )}
              <Image
                src={provider.profileImage}
                alt={provider.name}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
              />
            </div>
            
            {/* Verification Badge removed as requested */}
          </div>

          {/* Provider Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {provider.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-3">
                {provider.serviceCategory}
              </p>
              
              {/* Rating */}
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={`${
                        i < Math.floor(provider.rating)
                          ? 'text-warning fill-current' :'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">
                  {provider.rating}
                </span>
                <span className="text-muted-foreground">
                  ({provider.reviewCount} reviews)
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {provider.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <Icon name={badge.icon} size={14} />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center lg:justify-start space-x-6 text-sm">
                <div className="text-center lg:text-left">
                  <div className="font-semibold text-foreground">
                    {provider.experience}+ years
                  </div>
                  <div className="text-muted-foreground">Experience</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-semibold text-foreground">
                    {provider.completedJobs}+
                  </div>
                  <div className="text-muted-foreground">Jobs Done</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-semibold text-foreground">
                    {provider.responseTime}
                  </div>
                  <div className="text-muted-foreground">Response Time</div>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" onClick={onShare} iconName="Share2" iconPosition="left">
                Share Profile
              </Button>
              <Button 
                variant={isFavorited ? "default" : "outline"}
                onClick={onFavorite}
                iconName="Heart"
                iconPosition="left"
              >
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderHero;