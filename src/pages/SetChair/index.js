import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SetChair.scss';
import classNames from 'classnames';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

const cx = classNames.bind(styles);

function SetChair() {
  const [quantity, setQuantity] = useState(0);
  const [selectedSeats, setSelectedSeat] = useState([]);
  const ticketPrice = 75000;
  const totalAmount = quantity * ticketPrice;

  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const { movieId, roomId, screeningId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [cinema, setCinema] = useState('');

  const [roomSeats, setRoomSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState({});

  const [user, setUser] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);
  const [avatar, setAvatar] = useState([]);

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  const formattedPrice = totalAmount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const navigate = useNavigate();

  const handleSeatClick = (seatId) => {
    console.log('Selected seat:', seatId); // Log ra seatId
    // Kiểm tra xem ghế đã được chọn chưa
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

    // Nếu ghế đã được chọn thì loại bỏ khỏi mảng selectedSeats
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

          // Lưu thông tin phòng vào sessionStorage chỉ với seatId
          const checkoutInfo = {
            selectedSeats: newlySelectedSeats,
            roomId,
          };
          sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));

          setTimeout(() => {
            sessionStorage.removeItem('checkoutInfo');
            showSessionExpiredAlert();
          }, 300 * 60 * 1000);
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
      cinema,
      roomName,
      selectedSeats,
      date: screening ? new Date(screening.startTime).toLocaleDateString() : null,
      totalPrice: formattedPrice,
      roomId,
    };
    sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
    setTimeout(() => {
      sessionStorage.removeItem('checkoutInfo');
      showSessionExpiredAlert();
      
    }, 0.2 * 60 * 1000);
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
          const response = await axios.put(`${apiUrl}/booking/clearSeatStatus`, {seatIds: selectedSeats});
          console.log("Clear Seat Data Selected SeatID", response.data); 
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
    const selectedSeatsInfo = selectedSeats.map((seatId) => convertSeatKeyToObject(seatId).seatId); // Sửa lại đây để chỉ lấy seatId

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

  const handleCheckSeats = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Thông báo !',
        text: 'Vui lòng đăng nhập tài khoản để thực hiện !',
        icon: 'warning',
      });
      return;
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

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${apiUrl}/film/getfilm/${movieId}`);
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
        const response = await fetch(`${apiUrl}/rooms/getRoom/${roomId}`);
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
      const response = await fetch(`${apiUrl}/seats/getSeatRoom/${movieId}`);
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
    try {
      const responseCinema = await fetch(`${apiUrl}/cinema/getCinema`);
      if (!responseCinema.ok) {
        throw new Error('Failed to fetch local for the Cinema');
      }
      const dataCinema = await responseCinema.json();
      setCinema(dataCinema.cinema); // Lưu ý: dữ liệu cinema được lấy từ trường cinema của object trả về
    } catch (error) {
      console.error('Error fetching cinema:', error);
    }
  };

  useEffect(() => {
    fecthCinema();
  }, []);

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
        console.log("data screening: ", data)
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

      return (
        <div
          key={seat.seatId}
          className={cx(
            'chair',
            isActive ? 'active' : '',
            isBooked ? 'booked' : '', // Thêm lớp CSS 'booked' nếu ghế đã được đặt từ API
          )}
          onClick={() => handleSeatClick(seat.seatId)}
        >
          <FontAwesomeIcon icon={faCouch} />
          <p>{`${rowChar}-${seat.seatNumber}`}</p>
          {isActive && <FontAwesomeIcon icon={faCheck} className={cx('icon-check')} />}
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
                {cinema && (
                  <div className={cx('box')}>
                    <span>Địa điểm Rạp</span>
                    <p>{cinema[0].location}</p>
                  </div>
                )}

                {roomName && (
                  <div className={cx('box')}>
                    <span>Phòng</span>
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
              {screening && <Link onClick={handleCheckTicket}>Kiểm tra</Link>}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default SetChair;
