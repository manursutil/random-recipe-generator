import { useState } from "react";
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useEffect } from "react";

const SingleRecipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [copied, setCopied] = useState(false);

    const getSingleRecipe = (id) => {
        api
            .getRecipeById(id)
            .then((data) => {
                setRecipe(data);
            })
            .catch(err => {
                console.error('API Error:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getSingleRecipe(id);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!recipe) return <div>Recipe not found</div>;

    const meal = recipe?.meals?.[0] || null;

    if (!meal) {
        return <div>No meal data available</div>;
    }

    const ingredients = Array.from({ length: 20 }, (_, i) => {
        const name = meal?.[`strIngredient${i + 1}`]?.trim();
        const amount = meal?.[`strMeasure${i + 1}`]?.trim();
        if (!name) return null;
        return { name, amount: amount || '' };
    }).filter(Boolean);

    const handleClick = () => {
        let url = document.location.href;
        // navigator.clipboard.writeText(url);
        // setCopied(true);
        navigator.share({ title: `${meal?.strMeal}`, url: url });
    };

    return (
        <div className="single-padding-top">
            <div className="recipe-card pop-in">
                <div className="card-header">
                    <div className="thumb-wrap">
                        {meal?.strMealThumb && (
                            <img className="thumb" src={meal.strMealThumb} alt={meal.strMeal} />
                        )}
                    </div>
                    <div className="title-area">
                        <h2 className="bubble-title">
                            {meal?.strMeal || 'Unknown Recipe'}
                            <button className="save-recipe" onClick={handleClick}>
                                Share!
                            </button>
                        </h2>
                        <div className="meta-chips">
                            {meal?.strCategory && <span className="chip">🍽️ {meal.strCategory}</span>}
                            {meal?.strArea && <span className="chip">🗺️ {meal.strArea}</span>}
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
                        {meal?.strInstructions || 'No instructions available'}
                    </p>
                </section>

                <section className="section actions">
                    {meal?.strYoutube && (
                        <a className="btn video" href={meal.strYoutube} target="_blank" rel="noreferrer">
                            ▶️ Watch Video
                        </a>
                    )}
                    <span className="source">
                        Source: {meal?.strSource ? (
                            <a href={meal.strSource} target="_blank" rel="noreferrer">{meal.strSource}</a>
                        ) : 'Unknown'}
                    </span>
                </section>
            </div>
        </div>
    );
};

export default SingleRecipe;