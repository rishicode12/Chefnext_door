import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GalleryTab = ({ provider }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { value: 'all', label: 'All Work', count: provider.gallery.length },
    { value: 'before-after', label: 'Before & After', count: provider.gallery.filter(item => item.category === 'before-after').length },
    { value: 'completed', label: 'Completed Projects', count: provider.gallery.filter(item => item.category === 'completed').length },
    { value: 'process', label: 'Work in Progress', count: provider.gallery.filter(item => item.category === 'process').length },
  ];

  const filteredGallery = selectedCategory === 'all' 
    ? provider.gallery 
    : provider.gallery.filter(item => item.category === selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredGallery.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredGallery.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredGallery[newIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
            onClick={() => openLightbox(item)}
          >
            <Image
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon name="ZoomIn" size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                {item.category.replace('-', ' ')}
              </span>
            </div>

            {/* Before/After Badge */}
            {item.category === 'before-after' && (
              <div className="absolute bottom-2 right-2">
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full font-medium">
                  B/A
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGallery.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Image" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No images found</h3>
          <p className="text-muted-foreground">No work samples available for this category.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-300 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <Icon name="X" size={20} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
            >
              <Icon name="ChevronRight" size={24} />
            </button>

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-white/80 text-sm mb-2">
                  {selectedImage.description}
                </p>
                <div className="flex items-center space-x-4 text-white/60 text-sm">
                  <span>{selectedImage.date}</span>
                  <span>•</span>
                  <span>{selectedImage.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load More */}
      {provider.gallery.length > 12 && (
        <div className="text-center">
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Load More Images
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;