import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SetChair.scss';
import classNames from 'classnames';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const cx = classNames.bind(styles);

function SetChair() {
  const [quantity, setQuantity] = useState(0);
  const [selectedSeats, setSelectedSeat] = useState([]);
  const ticketPrice = 75000;
  const totalAmount = quantity * ticketPrice;

  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const { movieId, roomId, cinemaId, screeningId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [cinema, setCinema] = useState('');

  const [roomSeats, setRoomSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState({});
  const formattedPrice = totalAmount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const navigate = useNavigate();

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatKey = `${rowIndex}-${seatIndex}`;
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [seatKey]: !prevStatus[seatKey],
    }));
  };

  const handleCreateTicket = () => {
    const newlySelectedSeats = Object.entries(seatStatus)
      .filter(([_, isSelected]) => isSelected)
      .map(([seatKey]) => seatKey);

    if (newlySelectedSeats.length > 0) {
      const confirmationMessage = `Bạn vừa chọn ghế: ${newlySelectedSeats.join(', ')}`;

      Swal.fire({
        icon: 'success',
        title: 'Xác nhận',
        text: confirmationMessage,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuantity(newlySelectedSeats.length);
          setSelectedSeat(newlySelectedSeats);
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Vui lòng chọn ghế trước khi tạo vé.',
      });
    }
  };

  const saveToSessionStorage = () => {
    const checkoutInfo = {
      movie,
      screening,
      roomName,
      selectedSeats,
      date: screening ? new Date(screening.startTime).toLocaleDateString() : null,
      totalPrice: formattedPrice,
    };
    sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
  };

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const responseScreening = await fetch(`http://localhost:5000/api/setchair/getScreening/${screeningId}`);
        if (!responseScreening.ok) {
          throw new Error('Failed to fetch screening');
        }
        const data = await responseScreening.json();
        setScreening(data.screening);
      } catch (error) {
        console.error('Error fetching screening:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch screening data',
        });
      }
    };
    if (screeningId) {
      fetchScreening();
    }
  }, [screeningId]);

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

    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/getRoom/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room seats');
        }
        const data = await response.json();
        setRoomSeats(data.seats);
        setRoomName(data.roomName);
      } catch (error) {
        console.error('Error fetching room seats:', error);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [movieId, roomId]);

  const fetchSeatsForMovie = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/seats/getSeatRoom/${movieId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch seats for the room');
      }
      const data = await response.json();
      setRoomSeats(data);
    } catch (error) {
      console.error('Error fetching seats for the room:', error);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchSeatsForMovie();
    }
  }, [roomId]);

  const fecthCinema = async () => {
    const resposeCinema = await fetch(`http://localhost:5000/api/cinema/getCinema/1`);
    if (!resposeCinema.ok) {
      throw new Error('Failed to fetch local for the Cinema');
    }
    const data = await resposeCinema.json();
    setCinema(data);
  };

  useEffect(() => {
    if (cinemaId) {
      fecthCinema();
    }
  }, [cinemaId]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const sortSeatsByRow = (seats) => {
    const seatsByRow = {};
    seats.forEach((seat) => {
      const { rowNumber, seatNumber } = seat;
      const rowKey = String.fromCharCode(65 + parseInt(rowNumber) - 1);
      if (!seatsByRow[rowKey]) {
        seatsByRow[rowKey] = [];
      }
      seatsByRow[rowKey].push(seatNumber);
    });
    for (let rowKey in seatsByRow) {
      seatsByRow[rowKey].sort((a, b) => a - b);
    }
    return seatsByRow;
  };

  const ROW_COUNT = 12;
  const SEAT_COUNT = 12;

  const renderSeats = () => {
    if (!roomSeats || roomSeats.length === 0) {
      return <div>Loading...</div>;
    }

    const seatsByRow = sortSeatsByRow(roomSeats);

    return Object.keys(seatsByRow).map((rowKey) => {
      const isSeatBooked = false;
      const rowSeats = seatsByRow[rowKey];
      const seatComponents = [];
      for (let i = 1; i <= SEAT_COUNT; i++) {
        const seatNumber = i < 10 ? `0${i}` : `${i}`;
        const seatKey = `${rowKey}-${seatNumber}`;
        seatComponents.push(
          <div
            key={seatKey}
            className={cx('chair', { booked: isSeatBooked, active: seatStatus[seatKey] })}
            onClick={() => handleSeatClick(rowKey, seatNumber)}
          >
            <FontAwesomeIcon icon={faCouch} />
            <p>{`${rowKey}-${seatNumber}`}</p>
            {isSeatBooked && <FontAwesomeIcon icon={faCheck} className={cx('icon-check')} />}
          </div>,
        );
      }
      return (
        <div className={cx('row')} key={rowKey}>
          {seatComponents}
        </div>
      );
    });
  };

  return (
    <section className={cx('wrapper-setchair')}>
      <div className={cx('setChair-wrapper')}>
        <div className={cx('setChair-container')}>
          <div className={cx('screen-chair')}>
            <div className={cx('village-seat')}>
              <div className={cx('screen')}>
                <span>Màn hình</span>
              </div>

              <div className={cx('entrance')}>Lối vào</div>

              <div className={cx('chairs')}>{renderSeats()}</div>

              <div className={cx('cinema-note')}>
                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế chưa đặt <FontAwesomeIcon icon={faCheck} />
                </p>
                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế đang được chọn <FontAwesomeIcon icon={faTimes} />
                </p>

                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế đã được đặt <FontAwesomeIcon icon={faTimes} />
                </p>
              </div>
            </div>

            <div className={cx('controll-btn')}>
              <button onClick={handleCreateTicket} className={cx('btn-ticket')}>
                Xác nhận chọn ghế
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx('additional-components')}>
        <section className={cx('showtime-wrapper')}>
          <div className={cx('showtime-container')}>
            <div className={cx('image-film')}>
              {movie && movie.image ? (
                <img src={`data:image/jpeg;base64, ${movie.image}`} alt={movie.name} />
              ) : (
                <div className={cx('placeholder-image')}>
                  <span>Image not available</span>
                </div>
              )}
            </div>

            <div className={cx('center')}>
              {movie && movie.name ? (
                <>
                  <h3>Tên phim</h3>
                  <span>{movie.name}</span>
                </>
              ) : (
                <div className={cx('placeholder-image')}>
                  <span>Name film not available</span>
                </div>
              )}

              <div className={cx('showtime')}>
                <div className={cx('box')}>
                  <span>Địa điểm Rạp</span>
                  <p>Quận 9, TP. Thủ Đức</p>
                </div>

                {roomName && (
                  <div className={cx('box')}>
                    <span>Rạp</span>
                    <p>{roomName}</p>
                  </div>
                )}

                {screening && (
                  <div className={cx('box')}>
                    <span>Chọn suất chiếu</span>
                    <p>{formatTime(new Date(screening.startTime))}</p>
                  </div>
                )}

                {screening && (
                  <div className={cx('box')}>
                    <span>Ngày chiếu</span>
                    <p>{new Date(screening.startTime).toLocaleDateString()}</p>
                  </div>
                )}

                <div className={cx('box')}>
                  <span>Số lượng</span>
                  <p>{quantity} vé</p>
                </div>

                <div className={cx('box')}>
                  <span>Tổng số tiền</span>
                  <p>{formattedPrice}</p>
                </div>
              </div>

              <div className={cx('total-chair')}>
                <span>Ghế đã được chọn: </span>
                {quantity > 0 && <span>{selectedSeats ? selectedSeats.join(', ') : ''}</span>}
              </div>
            </div>

            <div className={cx('actionButtons-checkout')}>
              <Link to={`/show/${movieId}`}>Trở lại</Link>
              {screening && (
                <Link
                  to={`/show/check-ticket/${screening.screeningId}/${screening.movieId}/${movieId}`}
                  onClick={saveToSessionStorage}
                >
                  Kiểm tra
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default SetChair;
