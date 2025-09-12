import { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // const categories = ["Beef", "Breakfast", "Chicken", "Dessert", "Goat", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian"];

    const fetchCategories = () => {
        setLoading(true);
        setError(null);
        api.
            getCategoryList()
            .then((data) => {
                const fetchedCategories = data?.meals?.map(meal => meal.strCategory) || [];
                setCategories(fetchedCategories);
            })
            .catch((err) => setError(err?.message || "Failed to fetch categories"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const fetchRecipes = async () => {
        if (!filter) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.getRecipeByCategory(filter);
            setRecipes(data?.meals || []);
        } catch (err) {
            setError(err?.message || "Failed to fetch recipes");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saved-list">
            <div className="search-wrap">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <label htmlFor="category" style={{ display: "none" }}>Choose a category</label>
                <select id="category" name="category" value={filter} onChange={handleFilter}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button className="copy-btn" onClick={fetchRecipes}>Search</button>
            </div>

            {loading && <div>Loading…</div>}
            {error && <div className="error-bubble">{error}</div>}

            {recipes.map((m) => (
                <div className="saved-item" key={m.idMeal}>
                    <Link className="saved-name" to={`/search/${m.idMeal}`}>
                        <div className="thumb-wrap">
                            <img className="thumb" src={m.strMealThumb} alt={m.strMeal} />
                        </div>
                    </Link>
                    <div className="saved-info">
                        <Link className="saved-name" to={`/search/${m.idMeal}`}>
                            {m.strMeal}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Search;