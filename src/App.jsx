import { useEffect, useMemo, useState } from 'react';
import api from './api/api';
import './App.css';
import Recipe from './components/Recipe';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Saved from './components/Saved';
import Header from './components/Header';
import PotButton from './components/PotButton';
import SingleRecipe from './components/SingleRecipe';
import Search from './components/Search';
import RecipeSearchCard from './components/RecipeSearchCard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

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

  // Auth state
  const refreshAuth = async (opts = {}) => {
    try {
      const data = await api.me();
      setUser(data?.user ?? data ?? true);
    } catch (e) {
      console.error(e);
      if (!opts.soft) {
        setUser(null);
      }
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = (opts) => mounted && refreshAuth(opts);
    load();
    const onAuthChanged = (e) => {
      if (!mounted) return;
      const loggedOut = !!e?.detail?.loggedOut;
      const nextUser = e?.detail?.user;
      if (loggedOut) {
        setUser(null);
        setSavedRecipes([]);
        setAuthChecking(false);
        return;
      }
      if (nextUser !== undefined) {
        setUser(nextUser);
        setAuthChecking(false);
      } else {
        load({ soft: true });
      }
    };
    window.addEventListener('auth:changed', onAuthChanged);
    return () => {
      mounted = false;
      window.removeEventListener('auth:changed', onAuthChanged);
    };
  }, []);

  useEffect(() => {
    if (!authChecking && !user) {
      setSavedRecipes([]);
    }
  }, [authChecking, user]);

  const refreshSavedRecipes = async (opts = {}) => {
    const { merge = false } = opts;
    try {
      const res = await api.listSavedRecipes();
      const ids = Array.isArray(res?.recipes) ? res.recipes : [];
      if (!ids.length && !merge) {
        setSavedRecipes([]);
        return;
      }
      const details = await Promise.all(
        ids.map(async (id) => {
          try {
            const data = await api.getRecipeById(id);
            const m = data?.meals?.[0];
            if (!m) return null;
            return {
              id: m.idMeal,
              name: m.strMeal,
              image: m.strMealThumb,
            };
          } catch {
            return null;
          }
        })
      );
      const fetched = details
        .filter(Boolean)
        .sort((a, b) => String(a.name).localeCompare(String(b.name)));
      if (!merge) {
        setSavedRecipes(fetched);
      } else {
        setSavedRecipes((prev) => {
          const map = new Map();
          for (const r of prev) map.set(String(r.id), r);
          for (const r of fetched) map.set(String(r.id), r);
          return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
        });
      }
    } catch (e) {
      console.error(e);
      setSavedRecipes([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = () => mounted && refreshSavedRecipes();
    load();
    const onAuthChanged = () => load();
    window.addEventListener('auth:changed', onAuthChanged);
    return () => {
      mounted = false;
      window.removeEventListener('auth:changed', onAuthChanged);
    };
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

  const handleSubmit = async (targetMeal) => {
    const m = targetMeal || meal;
    if (!m || !m.idMeal) return;
    if (!user) return;
    if (savedRecipes.some(r => String(r.id) === String(m.idMeal))) return;
    setSaving(true);
    try {
      await api.addSavedRecipe(Number(m.idMeal));
      setSavedRecipes((prev) => [
        ...prev,
        { id: m.idMeal, name: m.strMeal, image: m.strMealThumb },
      ]);
      refreshSavedRecipes({ merge: true });
    } catch (e) {
      console.error(e?.response?.data?.error || e?.message);
    } finally {
      setSaving(false);
    }
  };

  const removeRecipe = async (Id) => {
    if (!user) return;
    try {
      await api.deleteSavedRecipe(Number(Id));
      setSavedRecipes((prev) => prev.filter((r) => String(r.id) !== String(Id)));
    } catch (e) {
      console.error(e?.response?.data?.error || e?.message);
    }
  };

  return (
    <div className="mama-app">
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main className="mama-main">
                <PotButton loading={loading} fetchRecipe={fetchRecipe} />
                {error && <div className="error-bubble">{error}</div>}
                {meal ? (
                  <div className="recipe-area">
                    <Recipe key={meal.idMeal} meal={meal} meta={meta} handleSubmit={handleSubmit} savedRecipes={savedRecipes} canSave={!!user && !authChecking} />
                  </div>
                ) : (
                  !error && <div className="empty">No meal found.</div>
                )}
              </main>
            }
          />
          <Route
            path="/my-recipes"
            element={
              <main className="mama-main">
                <Saved savedRecipes={savedRecipes} removeRecipe={removeRecipe} />
              </main>
            }
          />
          <Route
            path="/my-recipes/:id"
            element={
              <SingleRecipe />
            }
          />
          <Route
            path="/search"
            element={
              <main className="mama-main">
                <Search />
              </main>
            }
          />
          <Route
            path="/search/:id"
            element={
              <RecipeSearchCard handleSubmit={handleSubmit} savedRecipes={savedRecipes} canSave={!!user && !authChecking} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
