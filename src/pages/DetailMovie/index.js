import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './DetailMovie.scss';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles);

function DetailMovie() {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/film/getfilm/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie');
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
  
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);
  

  const handleBuyTicket = () => {
      navigate(`/setchair/${movieId}`);
  };
  
  const formatDate = (releaseDate) => {
    const date = new Date(releaseDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="detailMovie">
      {movie && (
        <div className={cx('detailMovie-container')}>
          <div className={cx('image-detailFilm')}>
            <img src={`data:image/jpeg;base64, ${movie.image}`} alt={movie.name} />
            <div className={cx('showTitle')}>
              <span>{movie.name}</span>
              <button className={cx('btn-bookingTicket')} onClick={handleBuyTicket}>Mua vé</button>
            </div>
          </div>
          <section className={cx('container')}>
            <div className={cx('content')}>
              <p>Thời lượng phim: {movie.duration} phút</p>
              <p>{formatDate(movie.releaseDate)}</p>
            </div>
            <div className={cx('content-describe')}>
              <p>{movie.description}</p>
            </div>
          </section>
          <div className={cx('trailer-offical')}>
            <div className={cx('center')}>
              <span className={cx('title')}>Official Trailer</span>
              <iframe
                width="560"
                height="315"
                src={movie.trailer}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailMovie;
