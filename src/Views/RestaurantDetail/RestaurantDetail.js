import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetail.css';
import { useRestaurantContext } from '../../Context/RestaurantContext';
import { getUserId } from '../../services/user';
import { createFavorite, deleteFavorite } from '../../services/favorites';
import Notes from '../../Components/Notes/Notes';
import { fetchNote } from '../../services/notes';
import { useUserContext } from '../../Context/UserContext';
import Loader from '../../Components/Loader/Loader';

export default function RestaurantDetail() {
  const { restaurants, setError } = useRestaurantContext();
  const { currentUser } = useUserContext();
  const [success, setSuccess] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const { alias } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantObject = restaurants.find((item) => item.alias === alias);
        setRestaurant(restaurantObject);
        const noteData = await fetchNote(alias);
        if (noteData.length) setNotes(noteData[0]);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
        return () => {
          clearTimeout(timer);
        };
      } catch (e) {
        setError(e.message);
      }
    };
    fetchData();
  }, [alias, setError, setLoading, setRestaurant, restaurants]);
  if (loading || !restaurant) return <Loader />;

  const clickHandler = async () => {
    const user = getUserId();
    !restaurant.checked ? await createFavorite(alias, user) : await deleteFavorite(alias, user);
    setRestaurant((prev) => {
      return { ...prev, checked: !prev.checked };
    });
  };

  return (
    <div className="card">
      <h3 className="title">{restaurant.name}</h3>
      <div
        className="restaurant-image"
        style={{ backgroundImage: `url(${restaurant.image_url})` }}
      ></div>
      <p className="price">{restaurant.price}</p>
      <p className="stars">{Array(Math.floor(restaurant.rating)).fill('⭐️')}</p>
      <p>{restaurant.location.address1}</p>
      <p>{restaurant.display_phone}</p>
      <div className="card-info">
        {currentUser && (
          <div className="favorite" onClick={() => clickHandler()}>
            {restaurant.checked ? '❤️' : '🤍'}
          </div>
        )}
      </div>
      {success && <h3>Note successfully added!</h3>}

      {!notes ? (
        <Notes
          {...{
            setSuccess,
            alias,
            setNotes,
          }}
        />
      ) : (
        <p className="note">{notes.note}</p>
      )}
    </div>
  );
}
