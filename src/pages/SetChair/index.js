import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SetChair.scss';
import classNames from 'classnames';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';
import moment from 'moment';
import { data } from 'jquery';

const cx = classNames.bind(styles);

function SetChair() {
  const [quantity, setQuantity] = useState(0);
  const [selectedSeats, setSelectedSeat] = useState([]);
  const ticketPrice = 75000;
  const totalAmount = quantity * ticketPrice;

  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const { movieId, roomId, screeningId } = useParams();

  const [roomSeats, setRoomSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState([]);

  const [user, setUser] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);
  const [waitingSeats, setWaitingSeats] = useState([]);
  const [avatar, setAvatar] = useState([]);

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  const formattedPrice = totalAmount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const navigate = useNavigate();

  const handleSeatClick = (seatId) => {
    console.log('Selected seat:', seatId);
  
    const isSeatSelected = selectedSeats.includes(seatId);
    const isBooked = bookedSeats.includes(seatId);
  
    if (isBooked) {
      Swal.fire({
        icon: 'warning',
        title: 'Ghế đã được đặt',
        text: 'Vui lòng chọn ghế khác.',
      });
      return;
    }
  
  
  
    if (isSeatSelected) {
      const newSelectedSeats = selectedSeats.filter((selectedSeat) => selectedSeat !== seatId);
      setSelectedSeat(newSelectedSeats);
    } else {
      // Nếu ghế chưa được chọn thì thêm vào mảng selectedSeats
      const newSelectedSeats = [...selectedSeats, seatId];
      setSelectedSeat(newSelectedSeats);
    }
  
    // Cập nhật trạng thái của ghế
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [seatId]: !prevStatus[seatId],
    }));
  };
  

  const handleCreateTicket = () => {
    const newlySelectedSeats = Object.keys(seatStatus).filter((seatId) => seatStatus[seatId]);
    console.log('Selected seats:', newlySelectedSeats);

    if (newlySelectedSeats.length > 0) {
      const confirmationMessage = `Chọn thành công ghế`;

      Swal.fire({
        icon: 'success',
        title: 'Xác nhận',
        text: confirmationMessage,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuantity(newlySelectedSeats.length);
          setSelectedSeat(newlySelectedSeats);

          const checkoutInfo = {
            selectedSeats: newlySelectedSeats,
            roomId,
          };
          sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
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

  const saveToSessionStorage = async () => {
    const response = await axios.post(`${apiUrl}/booking/updateSeatStatus`, { seatIds: selectedSeats });
    console.log(response.data);
    const checkoutInfo = {
      screening,
      selectedSeats,
      date: screening ? new Date(screening.startTime).toLocaleDateString() : null,
      totalPrice: formattedPrice,
      roomId,
    };
    sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
    setTimeout(() => {
      sessionStorage.removeItem('checkoutInfo');
      showSessionExpiredAlert();
    }, 3 * 60 * 1000);
  };

  const showSessionExpiredAlert = () => {
    Swal.fire({
      title: 'Thời gian giữ ghế đã hết',
      text: 'Vui lòng thực hiện đặt vé lại.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${apiUrl}/booking/clearSeatStatus`, { seatIds: selectedSeats });
          console.log('Clear Seat Data Selected SeatID', response.data);
        } catch (error) {
          console.error('Error clearing seat status:', error);
        }

        sessionStorage.removeItem('checkoutInfo');

        window.history.back();
      }
    });
  };

  const convertSeatKeyToObject = (seatKey) => {
    const [rowNumber, seatNumber] = seatKey.split('-');
    return { rowNumber, seatNumber };
  };

  const handleCheckTicket = () => {
    const selectedSeatsInfo = selectedSeats.map((seatId) => convertSeatKeyToObject(seatId).seatId);

    if (selectedSeatsInfo.length === 0) {
      Swal.fire({
        title: 'Thông báo !',
        text: 'Vui lòng chọn ghế trước khi đặt vé !',
        icon: 'warning',
        button: 'OK',
      });
      return;
    } else {
      Swal.fire({
        title: 'Xác nhận',
        text: 'Ghế đã được chọn. Tiếp tục kiểm tra vé?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          saveToSessionStorage();
          navigate(`/show/check-ticket/${screening.screeningId}/${screening.movieId}/${roomId}`);
        }
      });
    }
  };

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const responseScreening = await fetch(`${apiUrl}/setchair/getScreening/${screeningId}`);
        // Các xử lý khác
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

  const fetchSeatsForMovie = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/seats/getSeatRoom/${screeningId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch seats for the room');
      }
      const data = await response.json();
      setRoomSeats(data);
      
      const waitingSeats = data.filter(seat => seat.seatStatus === "waiting").map(seat => seat.seatId);
      setWaitingSeats(waitingSeats);
    } catch (error) {
      console.error('Error fetching seats for the room:', error);
    }
  }, [roomId]);
  
  

  useEffect(() => {
    if (roomId) {
      fetchSeatsForMovie();
    }
  }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${apiUrl}/verify/current`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUser(response.data);
          axios
            .get(`${apiUrl}/verify/avatar`, {
              headers: {
                Authorization: token,
              },
            })
            .then((avatarResponse) => {
              setAvatar(avatarResponse.data.avatar);
            })
            .catch((error) => {
              console.error('Error fetching avatar data:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token', token);
        const userId = user && user.userId;
        console.log('UserId', userId);

        if (token && userId) {
          const response = await fetch(`${apiUrl}/booking/getBooking/${userId}`, {
            headers: {
              Authorization: token,
            },
          });

          console.log('response', response);

          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }
          const data = await response.json();
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [user]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(`${apiUrl}/booking/checkBookedSeats/${screeningId}/${movieId}/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booked seats');
        }
        const data = await response.json();
        console.log('data screening: ', data);
        setBookedSeats(data.bookedSeats);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };

    fetchBookedSeats();
  }, [screeningId, movieId, roomId]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const sortSeatsByRow = (seats) => {
    // Sắp xếp các ghế theo seatId
    seats.sort((a, b) => a.seatId - b.seatId);

    const seatsByRow = {};
    let currentRow = [];
    let currentRowNumber = seats[0].rowNumber;

    seats.forEach((seat) => {
      if (seat.rowNumber === currentRowNumber) {
        currentRow.push(seat);
      } else {
        seatsByRow[currentRowNumber] = currentRow;
        currentRow = [seat];
        currentRowNumber = seat.rowNumber;
      }
    });

    if (currentRow.length > 0) {
      seatsByRow[currentRowNumber] = currentRow;
    }

    return seatsByRow;
  };

  const renderSeats = () => {
    if (!roomSeats || roomSeats.length === 0) {
      return <div>Loading...</div>;
    }
  
    const seatsByRow = sortSeatsByRow(roomSeats);
    const renderedSeats = {};
  
    return Object.keys(seatsByRow).map((rowNumber) => {
      const rowSeats = seatsByRow[rowNumber];
      const seatComponents = rowSeats.map((seat) => {
        if (renderedSeats[seat.seatId]) {
          return null;
        }
  
        renderedSeats[seat.seatId] = true;
  
        const rowChar = String.fromCharCode(64 + parseInt(rowNumber));
        const isActive = selectedSeats.includes(seat.seatId);
        const isBooked = bookedSeats.includes(seat.seatId);
        const isWaiting = seat.status === "waiting"; 
  
        return (
          <div
            key={seat.seatId}
            className={cx(
              'chair',
              isActive ? 'active' : '',
              isBooked ? 'booked' : '',
              isWaiting ? 'waiting' : '' 
            )}
            onClick={() => {
              if (isWaiting) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Ghế đang chờ đặt',
                  text: 'Vui lòng chọn ghế khác hoặc chờ đợi.',
                });
              } else {
                handleSeatClick(seat.seatId);
              }
            }}
          >
            <FontAwesomeIcon icon={faCouch} />
            <p>{`${rowChar}-${seat.seatNumber}`}</p>
          </div>
        );
      });
  
      return (
        <div className={cx('row')} key={rowNumber}>
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
                  Ghế chưa đặt 
                </p>
                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế đang chọn
                </p>

                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế đang được chọn
                </p>

                <p>
                  <FontAwesomeIcon icon={faCouch} />
                  Ghế đã được đặt
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
              {screening && screening.movieName ? (
                <img src={`data:image/jpeg;base64, ${screening.movieImage}`} alt={screening.movieName} />
              ) : (
                <div className={cx('placeholder-image')}>
                  <span>Image not available</span>
                </div>
              )}
            </div>

            <div className={cx('center')}>
              {screening && screening.movieName ? (
                <>
                  <h3>Tên phim</h3>
                  <span>{screening.movieName}</span>
                </>
              ) : (
                <div className={cx('placeholder-image')}>
                  <span>Name film not available</span>
                </div>
              )}

              <div className={cx('showtime')}>
                {screening && screening.roomName && screening.location && (
                  <div className={cx('details')}>
                    <div className={cx('box')}>
                      <span>Địa điểm:</span>
                      <p>{screening.location}</p>
                    </div>

                    <div className={cx('box')}>
                      <span>phòng: </span>
                      <p>{screening.roomName}</p>
                    </div>
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
                    <p>{moment(screening.startTime).format('D/M/YYYY')}</p>
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
              {screening && <Link onClick={handleCheckTicket}>Kiểm tra</Link>}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default SetChair;
