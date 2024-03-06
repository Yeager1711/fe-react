import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScreeningRate.scss';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const cx = classNames.bind(styles);

function ScreeningRate() {
  const [screenings, setScreenings] = useState([]);
  const [films, setFilms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCreating, setIsCreating] = useState(true);

  const fetchScreenings = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/screening/allScreenings');
      setScreenings(response.data.screenings);
    } catch (error) {
      console.error('Error fetching screenings:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi tải thông tin suất chiếu.',
        icon: 'error',
      });
    }
  }, []);

  useEffect(() => {
    fetchScreenings();
  }, [fetchScreenings]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomResponse = await axios.get('http://localhost:5000/api/rooms/getRoom');
        setRooms(roomResponse.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi tải thông tin phòng.',
          icon: 'error',
        });
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const filmsResponse = await axios.get('http://localhost:5000/api/film/getfilm');
        setFilms(filmsResponse.data);
      } catch (error) {
        console.error('Error fetching films:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi tải thông tin phim.',
          icon: 'error',
        });
      }
    };

    fetchFilms();
  }, []);

  const handleCreateScreening = async () => {
    try {
      const cinemaId = '1';
      const createScreeningResponse = await axios.post('http://localhost:5000/api/screening/createScreening', {
        cinemaId,
      });
      console.log('Create Screening Response:', createScreeningResponse.data);
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã tạo suất chiếu thành công.',
        icon: 'success',
      });
      fetchScreenings();
    } catch (error) {
      console.error('Error creating screening:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi tạo suất chiếu.',
        icon: 'error',
      });
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0'); // Lấy giờ và padding 0 nếu cần
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút và padding 0 nếu cần
    return `${hours}:${minutes}`;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderFilmBoxes = (date) => {
    if (!selectedDate || selectedDate !== date) return null;

    const filmsToShow = [];

    // Lặp qua từng phim
    Object.keys(groupedScreenings[date]).forEach((roomId) => {
      groupedScreenings[date][roomId].forEach((screening) => {
        const film = films.find((f) => f.movieId === screening.movieId);
        const existingFilmIndex = filmsToShow.findIndex((f) => f.movieId === film.movieId);

        // Kiểm tra xem phim đã tồn tại trong danh sách hiển thị hay chưa
        if (existingFilmIndex === -1) {
          filmsToShow.push({
            ...film,
            screenings: [screening],
          });
        } else {
          // Nếu đã tồn tại, thêm thời gian chiếu vào phim đã có
          filmsToShow[existingFilmIndex].screenings.push(screening);
        }
      });
    });

    const handleCreateOrUpdateScreening = async() =>{
      if(isCreating) {
        handleCreateScreening()
      }else {
        handleUpdateScreening();
      }
    }

    const handleUpdateScreening = async () => {
      try {
        const cinemaId = '1';
        const updateScreeningResponse = await axios.post('http://localhost:5000/api/screening/updateScreening', {
          cinemaId,
        });
        console.log('Update Screening Response:', updateScreeningResponse.data);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã cập nhật suất chiếu thành công.',
          icon: 'success',
        });
        fetchScreenings();
      } catch (error) {
        console.error('Error updating screening:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Đã xảy ra lỗi khi cập nhật suất chiếu.',
          icon: 'error',
        });
      }
    };

    return (
      <div>
        {filmsToShow.map((film, index) => (
          <div key={index} className={cx('wrapper-info')}>
            <h3>{film.name}</h3>
            <div className={cx('wrapper-time')}>
              {film.screenings
                .map((screening) => {
                  const startTime = new Date(screening.startTime);
                  const formattedStartTime = formatTime(startTime); 
                  return { ...screening, formattedStartTime };
                })
                .sort((a, b) => {
                  return new Date(a.startTime) - new Date(b.startTime);
                })
                .map((screening, index) => {
                  const startTime = new Date(screening.startTime);
                  if (startTime.getHours() > 7 || (startTime.getHours() === 9 && startTime.getMinutes() >= 0)) {
                    if (startTime.getHours() < 23 || (startTime.getHours() === 23 && startTime.getMinutes() <= 59)) {
                      return (
                        <div className={cx('timeScreening')} key={index}>
                          <div className={cx('time')}>
                            <div className={cx('time-rate')}>
                              <span>
                                <p>
                                  {formatTime(screening.startTime)}{' '}
                                  {rooms.find((room) => room.roomId === screening.roomId).roomName}
                                </p>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const sortAndGroupScreenings = () => {
    const sortedScreenings = [...screenings].sort((a, b) => a.startTime - b.startTime);
    const groupedScreenings = {};

    sortedScreenings.forEach((screening) => {
      const date = new Date(screening.startTime).toLocaleDateString();
      const roomId = screening.roomId;
      if (!groupedScreenings[date]) {
        groupedScreenings[date] = {};
      }
      if (!groupedScreenings[date][roomId]) {
        groupedScreenings[date][roomId] = [];
      }
      groupedScreenings[date][roomId].push(screening);
    });

    // Sắp xếp các phòng trong mỗi ngày
    Object.keys(groupedScreenings).forEach((date) => {
      Object.keys(groupedScreenings[date]).forEach((roomId) => {
        groupedScreenings[date][roomId].sort((a, b) => a.startTime - b.startTime);
      });
    });

    return groupedScreenings;
  };

  const groupedScreenings = sortAndGroupScreenings();

  return (
    <div className={cx('screeningrate')}>
      <div className={cx('button-controllers')}>
        <div>
          <a>Admin </a>
          <FontAwesomeIcon icon={faChevronRight} />
          <a href="/admin/home">Home </a>
          <FontAwesomeIcon icon={faChevronRight} />
          <a>Screening Rate</a>
        </div>

        <div>
          <button onClick={handleCreateScreening}>Tạo Suất chiếu</button>
        </div>
      </div>

      <div className={cx('screeningrate-container')}>
        <h1>Lịch chiếu: </h1>
        <div className={cx('dates-container')}>
          {Object.keys(groupedScreenings).map((date, dateIndex) => (
            <div key={dateIndex} onClick={() => handleDateClick(date)} className={cx('date-box')}>
              <span>{date}</span>
            </div>
          ))}
        </div>

        <div className={cx('film-boxes-container')}>
          {Object.keys(groupedScreenings).map((date, dateIndex) => (
            <div key={dateIndex} className={cx('film-boxes')}>
              {renderFilmBoxes(date)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScreeningRate;
