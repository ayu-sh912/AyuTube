import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
    <div>
        <Link to="/">AyuTube</Link>
        {token && <Link to="/upload">Upload</Link>}
    </div>

    <div>
        {!token ? (
        <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
        </>
        ) : (
        <button onClick={handleLogout}>Logout</button>
        )}
    </div>
    </nav>

  );
};

export default Navbar;
