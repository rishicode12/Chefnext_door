import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickAccessTiles = ({ onCategorySelect }) => {
  const quickCategories = [
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: 'Wrench',
      color: 'bg-blue-500 text-white',
      serviceCount: 45,
      urgent: true
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: 'Zap',
      color: 'bg-yellow-500 text-white',
      serviceCount: 32,
      urgent: true
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      icon: 'Sparkles',
      color: 'bg-green-500 text-white',
      serviceCount: 78,
      popular: true
    },
    {
      id: 'carpanter',
      name: 'Carpanter',
      icon: 'Hammer',
      color: 'bg-orange-500 text-white',
      serviceCount: 56
    },
    {
      id: 'beauty',
      name: 'Beauty',
      icon: 'Scissors',
      color: 'bg-pink-500 text-white',
      serviceCount: 23
    },
    {
      id: 'automotive',
      name: 'Auto Care',
      icon: 'Car',
      color: 'bg-purple-500 text-white',
      serviceCount: 19
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Access</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All Categories
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
              {category.serviceCount} providers
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessTiles;