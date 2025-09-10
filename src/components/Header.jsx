const Header = () => {
    return (
        <header className="mama-header">
            <div className="mama-title">
                <span className="mama-logo" aria-hidden>👩
                    <span className="mama-logo-hat" aria-hidden>🍳</span>
                </span>
                <h1>Cooking Mama's Recipe Generator</h1>
            </div>
            <nav className="mama-nav" aria-label="Cute kitchen navigation">
                <button className="nav-pill" type="button" aria-label="Home">🏠 Home</button>
                <button className="nav-pill" type="button" aria-label="Recipes">🍲 Saved recipes</button>
            </nav>
        </header>
    );
};

export default Header;