import { useEffect, useState } from "react";

function Photos({ albumId, title }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);

  const loadPhotos = async (isInitialLoad = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=5&albumId=${albumId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMorePhotos(false);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...data]);
      }
      
      if (isInitialLoad) {
        setInitialLoad(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPhotos(true);
  }, []);
  useEffect(() => {
    if (!initialLoad && hasMorePhotos) {
      loadPhotos();
    }
  }, [page]);
  if (loading && initialLoad) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <h2>{title}</h2>
      {photos.map((photo) => (
        <img key={photo.id} src={photo.thumbnailUrl} alt={photo.title} />
      ))}
      {!initialLoad && hasMorePhotos && (
        <button onClick={() => setPage((prevPage) => prevPage + 1)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Photos'}
        </button>
      )}
      {!hasMorePhotos && <div>אין עוד תמונות</div>}
    </div>
  );
}
export default Photos;