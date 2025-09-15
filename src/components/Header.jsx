import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    const refreshAuth = (opts = {}) => {
        api
            .me()
            .then((data) => {
                setUser(data?.user ?? data ?? true);
            })
            .catch(() => {
                if (!opts.soft) {
                    setUser(null);
                }
            })
            .finally(() => setChecking(false));
    };

    useEffect(() => {
        let mounted = true;
        refreshAuth();
        const onFocus = () => mounted && refreshAuth();
        const onAuthChanged = (e) => {
            if (!mounted) return;
            const loggedOut = !!e?.detail?.loggedOut;
            const nextUser = e?.detail?.user ?? null;
            if (loggedOut) {
                setUser(null);
                setChecking(false);
                return; // skip verify immediately to avoid UI flash
            }
            if (nextUser) {
                setUser(nextUser);
                setChecking(false);
            }
            setTimeout(() => refreshAuth({ soft: true }), 250);
        };
        window.addEventListener("focus", onFocus);
        window.addEventListener("auth:changed", onAuthChanged);
        return () => {
            mounted = false;
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("auth:changed", onAuthChanged);
        };
    }, []);

    useEffect(() => {
        // Soft refresh on route change to avoid flicker just after login/signup
        refreshAuth({ soft: true });
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await api.logout();
            setUser(null);
            navigate("/");
            window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user: null, loggedOut: true } }));
        } catch (e) {
            console.error(e.message);
        }
    };

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
                <div className="nav-auth">
                    {!checking && (user ? (
                        <button className="nav-pill" onClick={handleLogout} aria-label="Logout">🚪 Logout</button>
                    ) : (
                        <>
                            <NavLink className="nav-pill" to="/login" aria-label="Login">🔐 Login</NavLink>
                            <NavLink className="nav-pill" to="/signup" aria-label="Signup">📝 Sign up</NavLink>
                        </>
                    ))}
                </div>
            </nav>

        </header>
    );
};

export default Header;
