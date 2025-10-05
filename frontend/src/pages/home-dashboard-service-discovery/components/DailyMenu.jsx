import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyMenu = ({ onMenuSelect }) => {
  const menuItems = [
    {
      id: 'indian-entheic-cuisine',
      name: 'Indian Entheic Cuisine',
      icon: 'Utensils',
      description: 'Traditional Indian dishes with authentic spices',
      prepTime: '25-30 min',
      price: '₹199',
      available: true
    },
    {
      id: 'south-indian-cuisine',
      name: 'South Indian Cuisine',
      icon: 'Soup',
      description: 'Authentic dosa, idli, and sambar',
      prepTime: '20-25 min',
      price: '₹149',
      available: true
    },
    {
      id: 'international-cuisine',
      name: 'International Cuisine',
      icon: 'Globe',
      description: 'Pasta, pizza, and global favorites',
      prepTime: '30-35 min',
      price: '₹299',
      available: true
    },
    {
      id: 'dessert-option',
      name: 'Dessert Option',
      icon: 'Cake',
      description: 'Chocolate cake with ice cream',
      prepTime: '10-15 min',
      price: '₹89',
      available: true
    }
  ];

  return (
    <div className="mb-8">
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Icon name="Utensils" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Daily Menu</h2>
            <p className="text-sm text-muted-foreground">Fresh options updated daily</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`bg-card border rounded-lg p-4 ${
                item.available 
                  ? 'border-border hover:border-primary/50 hover:shadow-md' 
                  : 'border-border opacity-60'
              } transition-all duration-200`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.available 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={item.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                    }`}></div>
                    <span className="text-xs text-muted-foreground">
                      {item.available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{item.prepTime}</span>
                </div>
                <div className="font-medium text-foreground">
                  {item.price}
                </div>
              </div>

              <Button
                variant={item.available ? "primary" : "outline"}
                disabled={!item.available}
                onClick={() => onMenuSelect(item)}
                className="w-full text-xs py-2"
              >
                {item.available ? (
                  <>
                    <Icon name="ShoppingCart" size={12} className="mr-1" />
                    Order Now
                  </>
                ) : (
                  'Sold Out'
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Daily Menu Notice</p>
              <p className="text-muted-foreground">
                Menu items may vary based on ingredient availability. Preparation times are estimated and may vary during peak hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMenu;