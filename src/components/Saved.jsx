import { Link } from "react-router-dom";
import { useState } from "react";

const Saved = ({ savedRecipes = [] }) => {
    const [copied, setCopied] = useState(false);

    if (!savedRecipes.length) {
        return <p>No saved recipes yet.</p>;
    }

    const handleClick = () => {
        let url = document.location.href;
        navigator.clipboard.writeText(url).then(() => {
            console.log('Copied!');
        }, () => {
            console.log('Copy error');
        });
        setCopied(true);
    };

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
                        <Link to={`/my-recipes/${recipe.id}`}>
                            {recipe.name}
                            <button className="save-recipe" onClick={handleClick}>
                                {!copied ? "Copy to Clipboard!" : "Copied! ✓"}
                            </button>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Saved;
