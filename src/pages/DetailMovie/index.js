import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './DetailMovie.scss';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const cx = classNames.bind(styles);

function DetailMovie() {
  const [movie, setMovie] = useState(null);
  const [room, setRoom] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedScreenings, setSelectedScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null); // State để lưu trữ thông tin suất chiếu được chọn

  const { roomId, movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/film/getfilm/${movieId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie');
        }
        const dataFilm = await response.json();
        setMovie(dataFilm);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/getRoom/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room');
        }
  
        const dataRoom = await response.json();
        setRoom(dataRoom);
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };
  
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);
  

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/screening/movieScreenings/${movieId}`);
        const { screenings, roomId } = response.data;
        setScreenings(screenings);
        setRoom(roomId); // Đặt roomId từ dữ liệu phản hồi API
        console.log('Chi tiết suất chiếu', screenings);
      } catch (error) {
        console.error('Lỗi khi tải danh sách suất chiếu:', error);
      }
    };

    if (movieId) {
      fetchScreenings();
    }
  }, [movieId]);

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0'); // Lấy giờ và padding 0 nếu cần
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút và padding 0 nếu cần
    return `${hours}:${minutes}`;
  };

  const formatDate = (releaseDate) => {
    const date = new Date(releaseDate);
    return format(date, 'MMMM/dd/yyyy', { locale: vi });
  };

  const handleDateClick = (date) => {
    setSelectedDate(selectedDate === date ? null : date); // Nếu đã chọn thì bỏ chọn, ngược lại chọn ngày mới
    setSelectedScreenings(screenings.filter((screening) => formatDate(screening.startTime) === date));
  };

  const groupScreeningsByDate = (screenings) => {
    const groupedScreenings = {};
    screenings.forEach((screening) => {
      const date = formatDate(screening.startTime);
      if (!groupedScreenings[date]) {
        groupedScreenings[date] = [];
      }
      groupedScreenings[date].push(screening);
    });
    return groupedScreenings;
  };

  return (
    <div className="detailMovie">
      {movie && (
        <div className={cx('detailMovie-container')}>
          <div className={cx('image-detailFilm')}>
            <img src={`data:image/jpeg;base64, ${movie.image}`} alt={movie.name} />
            <div className={cx('showTitle')}>
              <span>{movie.name}</span>
            </div>
          </div>
          <div className={cx('showtimes')}>
            <div className={cx('showtimes-wrapper')}>
              <h3>Chọn suất chiếu</h3>
              <div className={cx('showtimes-container')}>
                {Object.entries(groupScreeningsByDate(screenings)).map(([date, screeningsByDate]) => (
                  <div key={date}>
                    <div
                      className={cx('showtimes-day', { active: selectedDate === date })}
                      onClick={() => handleDateClick(date)}
                    >
                      <span style={{ background: selectedDate === date ? '#f5b324' : 'inherit' }}>
                        {formatDate(date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedDate && (
                <div className={cx('showtimes-times')}>
                  {selectedScreenings.map((screening) => (
                    <Link
                      to={`/setchair/show/${screening.screeningId}/${movieId}/${screening.roomId}`}
                      key={screening.screeningId}
                      onClick={() => console.log('Room ID:', screening.roomId)} // Log roomId từ mỗi suất chiếu
                    >
                      {formatTime(screening.startTime)}
                    </Link>
                  ))}
                </div>
              )}
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
        </div>
      )}
    </div>
  );
}

export default DetailMovie;
