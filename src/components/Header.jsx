import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="mama-header">
            <div className="mama-title">
                <h1>Cooking Mama's Recipe Generator</h1>
                <img src="/cooking_mama.png" alt="Cooking Mama" className="mama-logo" />
            </div>
            <nav className="mama-nav" aria-label="Cute kitchen navigation">
                <NavLink className="nav-pill" to="/" aria-label="Home">🏠 Home</NavLink>
                <NavLink className="nav-pill" to="/my-recipes" aria-label="Recipes">🍲 Saved recipes</NavLink>
                <NavLink className="nav-pill" to="/search" aria-label="Search">🔍 Search</NavLink>
            </nav>

        </header>
    );
};

export default Header;
