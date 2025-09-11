const PotButton = ({ loading, fetchRecipe }) => {
    return (
        <div className="cta">
            <button
                type="button"
                className={`mama-pot-button ${loading ? 'cooking' : ''}`}
                onClick={fetchRecipe}
                disabled={loading}
                aria-live="polite"
            >
                <span className="pot-top" aria-hidden></span>
                <span className="steam" aria-hidden></span>
                <span className="label">{loading ? 'Cooking…' : 'Generate Recipe'}</span>
            </button>
            {loading && (
                <div className="mama-timer" role="status" aria-label="Loading">
                    <div className="timer-face">
                        <div className="hand"></div>
                    </div>
                    <div className="timer-bar">
                        <div className="bar-fill"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PotButton;