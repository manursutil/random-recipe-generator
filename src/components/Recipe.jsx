const Recipe = ({ meal, meta, handleSubmit, savedRecipes }) => {
    const ingredients = Array.from({ length: 20 }, (_, i) => {
        const name = meal?.[`strIngredient${i + 1}`]?.trim();
        const amount = meal?.[`strMeasure${i + 1}`]?.trim();
        if (!name) return null;
        return { name, amount: amount || '' };
    }).filter(Boolean);

    const hats = meta?.hats || 1;
    const hatsIcons = '👩‍🍳'.repeat(hats);

    const isSaved = savedRecipes.some(recipe => recipe.id === meal.idMeal);

    return (
        <div className="recipe-card pop-in">
            <div className="card-header">
                <div className="thumb-wrap">
                    {meal.strMealThumb && (
                        <img className="thumb" src={meal.strMealThumb} alt={meal.strMeal} />
                    )}
                </div>
                <div className="title-area">
                    <h2 className="bubble-title">
                        {meal.strMeal}
                        <button className="save-recipe" onClick={handleSubmit}>
                            {isSaved ? "Saved! ✓" : "Save Recipe!"}
                        </button>
                    </h2>
                    <div className="meta-chips">
                        {meal.strCategory && <span className="chip">🍽️ {meal.strCategory}</span>}
                        {meal.strArea && <span className="chip">🗺️ {meal.strArea}</span>}
                        {meta && (
                            <>
                                <span className="chip">⏱️ {meta.estMinutes} min</span>
                                <span className="chip" title={meta.difficulty}> {hatsIcons} {meta.difficulty}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {ingredients.length > 0 && (
                <section className="section">
                    <h3 className="section-title">🛒 Ingredients</h3>
                    <table className="ingredients kawaii">
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((row, idx) => (
                                <tr key={`${row.name}-${idx}`}>
                                    <td><span className="ing-emoji" aria-hidden>🥄</span> {row.name}</td>
                                    <td>{row.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <section className="section">
                <h3 className="section-title">👩‍🍳 Instructions</h3>
                <p className="instructions cute">
                    {meal.strInstructions}
                </p>
            </section>

            <section className="section actions">
                {meal.strYoutube && (
                    <a className="btn video" href={meal.strYoutube} target="_blank" rel="noreferrer">
                        ▶️ Watch Video
                    </a>
                )}
                <span className="source">
                    Source: {meal.strSource ? (
                        <a href={meal.strSource} target="_blank" rel="noreferrer">{meal.strSource}</a>
                    ) : 'Unknown'}
                </span>
            </section>
        </div>
    );
};

export default Recipe;
