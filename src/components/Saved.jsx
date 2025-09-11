import { Link } from "react-router-dom";
import { useState } from "react";

const Saved = ({ removeRecipe, savedRecipes = [] }) => {
    const [copiedId, setCopiedId] = useState(null);
    const [filter, setFilter] = useState('');

    if (!savedRecipes.length) {
        return <p>No saved recipes yet.</p>;
    }

    const handleCopy = (id) => {
        const url = `${window.location.origin}/my-recipes/${id}`;
        navigator.clipboard.writeText(url)
            .then(() => console.log('Copied!'))
            .catch(() => console.log('Copy error'));
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleRemove = (recipeId) => {
        removeRecipe(recipeId);
    };

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const itemsToShow = filter
        ? savedRecipes.filter(recipe =>
            recipe.name.toLowerCase().startsWith(filter.toLowerCase())
        ) : savedRecipes;

    return (
        <div className="saved-list">
            <div className="search-wrap" role="search">
                <span className="search-icon" aria-hidden="true">🔎</span>
                <input
                    className="search-input"
                    type="text"
                    name="filter"
                    value={filter}
                    onChange={handleFilter}
                    placeholder="Search saved recipes..."
                    aria-label="Search saved recipes"
                />
                {filter && (
                    <button
                        type="button"
                        className="search-clear"
                        onClick={() => setFilter("")}
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
            {itemsToShow.map((recipe) => {
                return (
                    <div className="saved-item" key={recipe.id}>
                        <Link to={`/my-recipes/${recipe.id}`} className="thumb-link" aria-label={`Open ${recipe.name}`}>
                            <div className="thumb-wrap">
                                <img className="thumb" src={recipe.image} alt={recipe.name} />
                            </div>
                        </Link>

                        <div className="saved-info">
                            <Link className="saved-name" to={`/my-recipes/${recipe.id}`}>{recipe.name}</Link>
                            <div className="saved-actions">
                                <button className="copy-btn" onClick={() => handleCopy(recipe.id)}>
                                    {copiedId === recipe.id ? "Copied! ✓" : "Copy link"}
                                </button>
                                <button className="delete-recipe" onClick={() => handleRemove(recipe.id)} aria-label={`Delete ${recipe.name}`} title="Delete recipe">🗑️</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Saved;
