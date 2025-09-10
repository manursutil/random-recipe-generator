import { useEffect, useMemo, useState } from 'react';
import api from './api/api';
import './App.css';
import Recipe from './components/Recipe';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Header from './components/Header';
import PotButton from './components/PotButton';


function App() {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecipe = () => {
    setLoading(true);
    setError(null);
    api
      .getRandomRecipe()
      .then((data) => setRecipe(data))
      .catch((err) => setError(err?.message || 'Failed to fetch recipe'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  const meal = recipe?.meals?.[0] || null;

  const meta = useMemo(() => {
    if (!meal) return null;
    const ingredients = Array.from({ length: 20 }, (_, i) => {
      const name = meal?.[`strIngredient${i + 1}`]?.trim();
      const amount = meal?.[`strMeasure${i + 1}`]?.trim();
      if (!name) return null;
      return { name, amount: amount || '' };
    }).filter(Boolean);

    const steps = (meal.strInstructions || '')
      .split(/\n+|\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const estMinutes = Math.max(15, Math.min(90, ingredients.length * 3 + steps.length * 4));
    const difficulty = ingredients.length <= 6 ? 'Easy' : ingredients.length <= 12 ? 'Medium' : 'Hard';
    const hats = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    return { estMinutes, difficulty, hats };
  }, [meal]);

  return (
    <div className="mama-app">
      <Header />
      <main className="mama-main">
        <PotButton loading={loading} fetchRecipe={fetchRecipe} />

        {error && <div className="error-bubble">{error}</div>}

        {meal ? (
          <div className="recipe-area">
            <Recipe key={meal.idMeal} meal={meal} meta={meta} />
          </div>
        ) : (
          !error && <div className="empty">No meal found.</div>
        )}
      </main>
    </div>
  );
}

export default App;
