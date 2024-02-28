import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SetChair.scss';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const cx = classNames.bind(styles);

function SetChair() {
  const [quantity, setQuantity] = useState(0);
  const [selectedSeats, setSelectedSeat] = useState([]);
  const ticketPrice = 75000;
  const totalAmount = quantity * ticketPrice;

  const [movie, setMovie] = useState(null);
  const { movieId, roomId  } = useParams();

  const [roomSeats, setRoomSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState({});
  const [selectedColor, setSelectedColor] = useState('#25b392');

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

    const fetchRoomSeats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/getRoom/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room seats');
        }
        const data = await response.json();
        console.log(data)
        setRoomSeats(data.seats);
      } catch (error) {
        console.error('Error fetching room seats:', error);
      }
    };

    if (roomId) {
      fetchRoomSeats();
    }
  }, [movieId, roomId]);

  const formattedPrice = totalAmount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const alphabet = Array.from({ length: 10 }, (_, index) => String.fromCharCode(65 + index));
  const seatsPerRow = 12;

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatKey = `${rowIndex}-${seatIndex}`;
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [seatKey]: !prevStatus[seatKey],
    }));
  };

  const isGapInRow = (rowIndex) => {
    const rowKey = rowIndex.toString();
    let isGapFound = false;

    for (let seatIndex = 0; seatIndex < seatsPerRow - 1; seatIndex++) {
      const currentSeatKey = `${rowKey}-${seatIndex}`;
      const nextSeatKey = `${rowKey}-${seatIndex + 1}`;

      if (seatStatus[currentSeatKey] && !seatStatus[nextSeatKey]) {
        isGapFound = true;
        break;
      }
    }

    return isGapFound;
  };

  const isGapInColumn = (seatIndex) => {
    let isGapFound = false;

    for (let rowIndex = 0; rowIndex < alphabet.length - 1; rowIndex++) {
      const currentSeatKey = `${rowIndex}-${seatIndex}`;
      const nextSeatKey = `${rowIndex + 1}-${seatIndex}`;

      if (seatStatus[currentSeatKey] && !seatStatus[nextSeatKey]) {
        isGapFound = true;
        break;
      }
    }

    return isGapFound;
  };

  const handleCreateTicket = () => {
    const hasGapInRows = Object.keys(seatStatus).some((seatKey) => isGapInRow(seatKey));
    const hasGapInColumns = Object.keys(seatStatus).some((seatKey) => isGapInColumn(seatKey));

    if (hasGapInColumns || hasGapInRows) {
      Swal.fire({
        icon: 'warning',
        title: '',
        text: 'Vui lòng chọn ghế một cách liên tục, không bỏ trống khoảng trống giữa hai ghế hoặc các hàng cột.',
      });
      return;
    }

    const newlySelectedSeats = Object.entries(seatStatus)
      .filter(([_, isSelected]) => isSelected)
      .map(([seatKey]) => {
        const [rowIndex, seatIndex] = seatKey.split('-');
        return `${alphabet[rowIndex]}${parseInt(seatIndex) + 1}`;
      });

    const confirmationMessage = `Bạn đã chọn ghế: ${newlySelectedSeats.join(', ')}`;

    if (newlySelectedSeats.length > 0) {
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

  const renderSeats = () => {
    return roomSeats.map((row, rowIndex) => (
      <div key={rowIndex} className={cx('row')}>
        {row.map((isSeatBooked, seatIndex) => {
          const seatKey = `${rowIndex}-${seatIndex}`;

          return (
            <div
              key={seatIndex}
              className={cx('chair', { booked: isSeatBooked })}
              style={{ backgroundColor: isSeatBooked ? selectedColor : '' }}
              onClick={() => handleSeatClick(rowIndex, seatIndex)}
            >
              <FontAwesomeIcon icon={faCouch} />
              <p>{`${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`}</p>
              {isSeatBooked && <FontAwesomeIcon icon={faCheck} className={cx('icon-check')} />}
            </div>
          );
        })}
      </div>
    ));
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
                  Ghế đã được đặt <FontAwesomeIcon icon={faTimes} />
                </p>
              </div>
            </div>

            <div className={cx('controll-btn')}>
              <button onClick={handleCreateTicket} className={cx('btn-ticket')}>
                {' '}
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

                <div className={cx('box')}>
                  <span>Rạp</span>
                  <p>Cenima N0-1</p>
                </div>

                <div className={cx('box')}>
                  <span>Chọn suất chiếu</span>
                  <p>23:00</p>
                </div>

                <div className={cx('box')}>
                  <span>Ngày chiếu</span>
                  <p>23/01/2024</p>
                </div>

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
              <a href="/show">Trở lại</a>
              <a href="/check-ticket">Kiểm tra</a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default SetChair;
