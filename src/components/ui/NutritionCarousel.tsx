
import { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface Tip {
  icon: string;
  title: string;
  description: string;
  type: 'hydration' | 'nutrition' | 'recipe';
  recipe?: {
    ingredients: string[];
    instructions: string[];
  };
}

const tips: Tip[] = [
  {
    icon: '🥤',
    title: 'Stay Hydrated',
    description: 'Drink at least 2L of water daily to stay hydrated!',
    type: 'hydration'
  },
  {
    icon: '🍉',
    title: 'Water-Rich Foods',
    description: 'Eat water-rich foods like watermelon & cucumber!',
    type: 'hydration'
  },
  {
    icon: '🥗',
    title: 'Pre-Workout Meal',
    description: 'Eat carbs & protein for energy!',
    type: 'nutrition'
  },
  {
    icon: '🍳',
    title: 'High-Protein Breakfast',
    description: 'Scrambled eggs with avocado toast',
    type: 'recipe',
    recipe: {
      ingredients: ['3 eggs', '1 avocado', '2 slices whole grain bread', 'Salt and pepper to taste'],
      instructions: ['Toast bread', 'Mash avocado and spread on toast', 'Scramble eggs', 'Season and serve']
    }
  }
];

export const NutritionCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentTip = tips[currentIndex];

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => 
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center flex-1">
            <span className="text-4xl">{currentTip.icon}</span>
            <h3 className="text-xl font-semibold mt-2">{currentTip.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % tips.length)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-muted-foreground mb-4">
          {currentTip.description}
        </p>
        {currentTip.type === 'recipe' && currentTip.recipe && (
          <div className="mt-4 space-y-2">
            <div className="text-sm">
              <strong>Ingredients:</strong>
              <ul className="list-disc list-inside">
                {currentTip.recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(currentIndex)}
            className={favorites.includes(currentIndex) ? 'text-red-500' : ''}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
