import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/autoplay';
import classNames from 'classnames/bind';
import styles from './Home.Module.scss';
import { useNavigate } from 'react-router-dom'; 

const cx = classNames.bind(styles);

const Home = () => {
  const [films, setFilms] = useState([]);
  const [currentFilmType, setCurrentFilmType] = useState('nowPlaying');
  const navigate = useNavigate();

  const handleFilmTypeChange = (filmChange) => {
    setCurrentFilmType(filmChange);
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:5000/api/film/getfilm')
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error('Error fetching films:', error));
  }, []);

  const renderFilms = () => {
    let filteredFilms = [];

    if (currentFilmType === 'nowPlaying') {
      filteredFilms = films.filter((film) => isNowPlaying(film.releaseDate));
    } else if (currentFilmType === 'comingSoon') {
      filteredFilms = films.filter((film) => !isNowPlaying(film.releaseDate));
    }

    // Sắp xếp các phim theo releaseDate
    filteredFilms.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

    return filteredFilms.map((film, index) => (
      <div className={cx('box')} key={index}>
        <div className="day-comingsoon">
          <span>{formatDate(film.releaseDate)}</span>
        </div>
        <div className={cx('film-image')}>
          <img src={`data:image/jpeg;base64, ${film.image}`} alt={film.name} />
        </div>
        <div className={cx('content')}>
          <div className={cx('content-detail')}>
            <h3 className={cx('name-film')}>{film.name}</h3>
            <div className={cx('button-control')}>
              <button className={cx('btn-bookingTicket')} onClick={() => handleBuyTicket(film)}>Mua vé</button>
            </div>
          </div>
          <p className={cx('describe')}>{film.title}</p>
          <span className={cx('movie-genre')}>2D</span>
        </div>
      </div>
    ));
  };

  const handleBuyTicket = (film) => {
    navigate(`/show/${film.movieId}`); 
  };

  const renderFilmSwiper = () => {
    let filteredFilms = [];

    if (currentFilmType === 'nowPlaying') {
      filteredFilms = films.filter((film) => isNowPlaying(film.releaseDate));
    } else if (currentFilmType === 'comingSoon') {
      filteredFilms = films.filter((film) => !isNowPlaying(film.releaseDate));
    }

    // Sắp xếp các phim theo releaseDate
    filteredFilms.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

    return (
      <Swiper
        className="mySwiper"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination
        mousewheel
        keyboard
      >
        {filteredFilms.map((film, index) => (
          <SwiperSlide key={index}>
            <div className={cx('home-wrapper')}>
              <div className={cx('image-wrapper')}>
                <img src={`data:image/jpeg;base64, ${film.image}`} alt={film.name} />
                <div className={cx('content-image')}>
                  <div className={cx('content')}>
                    <h3>{film.name}</h3>
                    <span>
                      <p>{film.description}</p>
                    </span>
                    <div className={cx('button-choose')}>
                      <button className={cx('btn-booking')}>Booking now</button>
                      <button className={cx('btn-watch')}>Watch Trailer</button>
                    </div>
                  </div>
                  <div className={cx('image-ct')}>
                    <img src={`data:image/jpeg;base64, ${film.image}`} alt={film.name} />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const isNowPlaying = (releaseDate) => {
    const currentDate = new Date();
    const filmReleaseDate = new Date(releaseDate);

    // Tính số ngày giữa ngày hiện tại và releaseDate
    const diffTime = Math.abs(filmReleaseDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 20;
  };

  const formatDate = (releaseDate) => {
    const date = new Date(releaseDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={cx('home')}>
      {renderFilmSwiper()}

      <section className={cx('film-container')}>
        {/* Render film buttons for different types */}
        <div className={cx('button-panigation')}>
          <div className={cx('center')}>
            <button onClick={() => handleFilmTypeChange('nowPlaying')}>Phim đang chiếu</button>
            <button onClick={() => handleFilmTypeChange('comingSoon')}>Phim sắp chiếu</button>
            <button onClick={() => handleFilmTypeChange('specialShow')}>Suất chiếu đặc biệt</button>
          </div>
        </div>

        {/* Render films */}
        <section className={cx('modelFilm-container')}>{renderFilms()}</section>
      </section>
    </div>
  );
};

export default Home;
