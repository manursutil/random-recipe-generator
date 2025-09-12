import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('category');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategories = () => {
        setLoading(true);
        setError(null);
        api.getCategoryList()
            .then((data) => {
                const fetchedCategories = data?.meals?.map(meal => meal.strCategory) || [];
                setCategories(fetchedCategories);
            })
            .catch((err) => setError(err?.message || "Failed to fetch categories"))
            .finally(() => setLoading(false));
    };

    const fetchAreas = () => {
        setLoading(true);
        setError(null);
        api.getAreaList()
            .then((data) => {
                const fetchedAreas = data?.meals?.map(area => area.strArea) || [];
                setAreas(fetchedAreas);
            })
            .catch((err) => setError(err?.message || "Failed to fetch areas"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
        fetchAreas();
    }, []);

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
        setFilter('');
    };

    const fetchRecipes = async () => {
        if (!filter) return;
        setLoading(true);
        setError(null);
        try {
            let data;
            if (filterType === 'category') {
                data = await api.getRecipeByCategory(filter);
            } else if (filterType === 'area') {
                data = await api.getRecipeByArea(filter);
            }
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

                <select value={filterType} onChange={handleFilterTypeChange}>
                    <option value="category">Category</option>
                    <option value="area">Area</option>
                </select>

                <label htmlFor="filter" style={{ display: "none" }}>Choose a {filterType}</label>
                <select id="filter" name="filter" value={filter} onChange={handleFilter}>
                    <option value="">Select a {filterType}</option>
                    {filterType === 'category' && categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    {filterType === 'area' && areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>

                <button className="copy-btn" onClick={fetchRecipes} disabled={!filter || loading}>
                    Search
                </button>
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