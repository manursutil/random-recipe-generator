import { NavLink } from "react-router-dom";

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
                <NavLink className="nav-pill" to="/" aria-label="Home">🏠 Home</NavLink>
                <NavLink className="nav-pill" to="/my-recipes" aria-label="Recipes">🍲 Saved recipes</NavLink>
            </nav>

        </header>
    );
};

export default Header;
