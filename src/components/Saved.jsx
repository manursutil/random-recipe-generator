import { Link } from "react-router-dom";

const Saved = ({ savedRecipes = [] }) => {
    if (!savedRecipes.length) {
        return <p>No saved recipes yet.</p>;
    }

    return (
        <div className="saved-list">
            {savedRecipes.map((recipe) => {
                return (
                    <div className="saved-item" key={recipe.id}>
                        <Link to={`/my-recipes/${recipe.id}`} className="thumb-link" aria-label={`Open ${recipe.name}`}>
                            <div className="thumb-wrap">
                                <img className="thumb" src={recipe.image} alt={recipe.name} />
                            </div>
                        </Link>
                        <Link to={`/my-recipes/${recipe.id}`}>{recipe.name}</Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Saved;
