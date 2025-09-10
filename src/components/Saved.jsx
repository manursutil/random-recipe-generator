const Saved = ({ savedRecipes = [] }) => {
    if (!savedRecipes.length) {
        return <p>No saved recipes yet.</p>;
    }

    return (
        <div className="card-header">
            {savedRecipes.map((recipe) => {
                return (
                    <div key={recipe.id}>
                        <div className="thumb-wrap">
                            <img className="thumb" src={recipe.image} alt={recipe.name} />
                        </div>
                        <p key={recipe.id}>{recipe.name}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Saved;
