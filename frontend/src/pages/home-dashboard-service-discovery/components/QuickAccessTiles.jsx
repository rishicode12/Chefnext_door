import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickAccessTiles = ({ onCategorySelect }) => {
  const quickCategories = [
    {
      id: 'pizza',
      name: 'Pizza',
      icon: 'Pizza',
      color: 'bg-red-500 text-white',
      serviceCount: 32,
      popular: true
    },
    {
      id: 'chinese',
      name: 'Chinese',
      icon: 'BowlFood',
      color: 'bg-yellow-500 text-white',
      serviceCount: 56
    },
    {
      id: 'south-indian',
      name: 'South Indian',
      icon: 'Soup',
      color: 'bg-green-500 text-white',
      serviceCount: 78
    },
    {
      id: 'indian',
      name: 'Indian',
      icon: 'Utensils',
      color: 'bg-orange-500 text-white',
      serviceCount: 45,
      popular: true
    },
    {
      id: 'burgers',
      name: 'Burgers',
      icon: 'Hamburger',
      color: 'bg-amber-500 text-white',
      serviceCount: 28
    },
    {
      id: 'rolls',
      name: 'Rolls',
      icon: 'Croissant',
      color: 'bg-purple-500 text-white',
      serviceCount: 23
    },
    {
      id: 'dosa',
      name: 'Dosa',
      icon: 'Croissant',
      color: 'bg-green-600 text-white',
      serviceCount: 35
    },
    {
      id: 'cakes',
      name: 'Cakes',
      icon: 'Cake',
      color: 'bg-pink-500 text-white',
      serviceCount: 19
    },
    {
      id: 'juices',
      name: 'Juices',
      icon: 'Wine',
      color: 'bg-cyan-500 text-white',
      serviceCount: 42
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Cuisine Categories</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All Cuisines
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="group relative bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-200 text-center"
          >
            {/* Badge */}
            {category.urgent && (
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                Urgent
              </div>
            )}
            {category.popular && (
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                Popular
              </div>
            )}

            <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
              <Icon name={category.icon} size={24} />
            </div>

            <h3 className="font-medium text-foreground text-sm mb-1">{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              {category.serviceCount} dishes
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessTiles;