import { useEffect, useState } from "react";
import Photos from "./Photos";
import { useNavigate } from 'react-router-dom';
function Albums({ user, setShow }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAlbums(data.filter((album) => album.userId === user.id));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        
      }
    };
    fetchAlbums();
  }, [user.id, navigate]);

  function openAlbum(id, title) {
    setShow(<Photos albumId={id} title={title} />);
    navigate(`/home/albums/${id}`);
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="albums">
      {albums.map((album) => (
        <div className="album" key={album.id} onClick={() => openAlbum(album.id, album.title)}>
          <h2 className="album-title">{album.id} {album.title}</h2>
        </div>
      ))}
    </div>
  );
}
export default Albums;