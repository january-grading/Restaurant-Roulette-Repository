import { NavLink } from 'react-router-dom';
import { useRestaurantContext } from '../../Context/RestaurantContext';
import { useUserContext } from '../../Context/UserContext';
import { logout } from '../../services/user';
import { fetchRestaurantZip } from '../../services/yelp';

export default function NavHeader() {
  const {
    currentUser,
    setCurrentUser,
    profile: { userName },
  } = useUserContext();
  const { setRestaurants } = useRestaurantContext();

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setRestaurants(await fetchRestaurantZip());
  };

  return (
    <div className="nav-header">
      <div>
        <button>
          <NavLink exact to="/">
            Home
          </NavLink>
        </button>
      </div>
      <div>
        {!currentUser && (
          <button>
            <NavLink to="/auth">Login/Sign-up</NavLink>
          </button>
        )}
      </div>
      <div>
        {currentUser && (
          <button>
            <NavLink exact to="/profile">
              Your profile
            </NavLink>
          </button>
        )}
      </div>
      <div>
        {currentUser && (
          <button>
            <NavLink exact to="/aboutme">
              About Creators
            </NavLink>
          </button>
        )}
      </div>
      <div>
        {currentUser && (
          <div>
            <p>User: {userName}</p>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
