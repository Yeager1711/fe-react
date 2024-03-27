import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './CheckTicket.scss';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import QRCode from 'qrcode.react';

import axios from 'axios';
import { set } from 'date-fns';

const cx = classNames.bind(styles);

function CheckTicket() {
  const [combo, setCombo] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const priceSeatDefault = 75000;

  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const { movieId, roomId, screeningId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [roomSeats, setRoomSeats] = useState([]);
  const [cinema, setCinema] = useState('');

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isModelActive, setIsModelActive] = useState(false);
  const [selectedFood, setSelectedFood] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [qrData, setQrData] = useState('');

  const totalPriceSeats = priceSeatDefault * quantity;
  const totalPriceFood = selectedFood.reduce((total, food) => total + food.price * (food.quantity || 1), 0);
  const transactionFee = totalPriceSeats + totalPriceFood;
  const tax = 5;
  const totalAmountToPay = transactionFee + transactionFee * (tax / 100);

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;
  // token
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`${apiUrl}/verify/current`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('checkoutInfo'));
    if (sessionData) {
      setSelectedSeats(sessionData.selectedSeats);
      setTotalAmount(sessionData.totalPrice || 0);
      setRoomName(sessionData.roomName);
    } else {
      setTotalAmount(0);
    }
  }, []);

  useEffect(() => {
    const totalPrice = priceSeatDefault * quantity;
    setTotalAmount(totalPrice);

    sessionStorage.setItem('checkoutInfo', JSON.stringify({ selectedSeats, quantity }));
  }, [quantity]);

  useEffect(() => {
    setQuantity(selectedSeats.length);
    sessionStorage.setItem('checkoutInfo', JSON.stringify({ selectedSeats, quantity }));
  }, [selectedSeats]);

  //  ------------------ API call ----------------------------
  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const responseCombo = await axios.get(`${apiUrl}/combo/getCombo`);
        setCombo(responseCombo.data);
      } catch (error) {
        console.error('Error fetching combo data:', error);
      }
    };

    fetchCombo();
  }, []);

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const responseScreening = await fetch(`${apiUrl}/setchair/getScreening/${screeningId}`);
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

  const fetchCinema = async () => {
    try {
      const responseCinema = await fetch(`${apiUrl}/cinema/getCinema`);
      if (!responseCinema.ok) {
        throw new Error('Failed to fetch local for the Cinema');
      }
      const dataCinema = await responseCinema.json();
      setCinema(dataCinema.cinema);
    } catch (error) {
      console.error('Error fetching cinema:', error);
    }
  };

  useEffect(() => {
    fetchCinema();
  }, []);

  const handleBooking = async () => {
    try {
      setIsModelActive(false);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Người dùng chưa xác thực');
      }

      const seatIds = selectedSeats;

      const requestData = {
        userId: user.userId,
        screeningId: screeningId,
        comboIds: selectedFood.map((food) => parseInt(food.comboId)),
        bookingDate: new Date().toISOString(),
        seatIds: seatIds,
        totalAmountToPay: totalAmountToPay,
      };

      // Gửi yêu cầu đặt vé lên server
      const response = await axios.post(`${apiUrl}/booking/bookingTicket`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra kết quả từ yêu cầu đặt vé
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Đặt vé thành công',
          text: 'Cảm ơn bạn đã đặt vé!',
        });
      } else {
        throw new Error('Đặt vé thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đặt vé:', error);
      Swal.fire({
        icon: 'error',
        title: 'Đặt vé thất bại',
        text: 'Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau!',
      });
    }
  };

  // ----------------- Fortmat & convert -----------------------
  function decodeBase64Image(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  // ------------------ handle ------------------
  const handleSelectCombo = (comboId) => {
    const existingFoodIndex = selectedFood.findIndex((item) => item.comboId === comboId);

    // Nếu combo đã tồn tại, không thêm mới mà chỉ cập nhật số lượng
    if (existingFoodIndex !== -1) {
      const updatedSelectedFood = [...selectedFood];
      updatedSelectedFood[existingFoodIndex].quantity = 1; // Luôn chỉ hiển thị số lượng là 1
      setSelectedFood(updatedSelectedFood);
    } else {
      const selectedFoodItem = combo.find((item) => item.comboId === comboId);
      if (selectedFoodItem) {
        const newSelectedFood = [selectedFoodItem];
        setSelectedFood(newSelectedFood);
      }
    }
  };

  const handleCreateQR = () => {
    const bookingInfo = {
      movieName: movie ? movie.name : '',
      roomName: roomName,
      screeningTime: screening ? formatTime(new Date(screening.startTime)) : '',
      selectedSeats: selectedSeats,
      totalAmount: totalAmountToPay,
    };

    setQrData(bookingInfo);
    setIsModelActive(true);
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  // Seat hold time
  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    let currentTime = new Date().getTime();

    // Thời gian kết thúc
    let endTime = currentTime + 3 * 60 * 1000;

    let x = setInterval(function () {
      let now = new Date().getTime();

      let distance = endTime - now;

      let minutes = ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-3);
      let seconds =
        (Math.floor((distance % (1000 * 60)) / 1000) < 10 ? '0' : '') + Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `<p>${minutes}</p><p>${seconds}</p>`;

      if (distance < 0) {
        clearInterval(x);
        countdownElement.innerHTML = 'Thời gian giữ ghế đã hết !';
      }
    }, 1000);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'F5') {
      event.preventDefault();
    }
  });

  return (
    <section className={cx('wrapper-setTicket')}>
      <section className={cx('setTick-wrapper')}>
        <h2 className={cx('setTick-title')}> Checkout Booking </h2>

        <div className={cx('setTick-container')}>
          <div className={cx('user-container')}>
            {user && (
              <span>
                Tài khoản:
                <p>{user.email}</p>
              </span>
            )}

            <div className={cx('info-container')}>
              <div className={cx('box')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="71" height="62"></svg>
                {user && <p className={cx('name-user')}> {user.fullname}</p>}
              </div>

              <div className={cx('box')}>
                <div className={cx('Seat-HoldTime')}>
                  <span>Thời gian giữ ghế: </span>
                  <div id="countdown"></div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx('food-container')}>
            <h3 className={cx('setTick-foodTitle')}>Chọn đồ ăn</h3>
            <div className={cx('container')}>
              {combo &&
                combo.map((itemCombo, index) => (
                  <div className={cx('box')} key={index}>
                    <img className={cx('image')} src={decodeBase64Image(itemCombo.image)} alt={itemCombo.name} />
                    <span className={cx('combo-food')}>x1 {itemCombo.name}</span>
                    <span className={cx('combo-price')}>{formatCurrency(itemCombo.price)}</span>
                    <button className={cx('choose')} onClick={() => handleSelectCombo(itemCombo.comboId)}>
                      chọn
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className={cx('reviewOrder-container')}>
            <h3 className={cx('setTick-orderTitle')}>Xem lại đơn đặt của bạn</h3>
            <div className={cx('wrapper-order')}>
              <div className={cx('price-seats')}>
                <span>{quantity} Ghế đã chọn</span>
                <span>
                  <p className={cx('value-combo')}>{selectedSeats.join(', ')}</p>
                </span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              <div className={cx('price-food')}>
                <span> Đồ ăn đã chọn </span>
                <span>
                  <span className={cx('quantity-foodSelected')}>
                    {Object.entries(
                      selectedFood.reduce((acc, food) => {
                        const existingFood = acc[food.name];
                        if (existingFood) {
                          existingFood.quantity++;
                        } else {
                          acc[food.name] = { ...food, quantity: 1 };
                        }

                        return acc;
                      }, {}),
                    ).map(([name, food]) => (
                      <span key={food.comboId} className={cx('food-selected')}>
                        {food.quantity > 1 ? `x${food.quantity} ` : ''}
                        <img src={decodeBase64Image(food.image)} alt="Image" />
                        {name},{' '}
                      </span>
                    ))}
                  </span>
                </span>
                <span>
                  {formatCurrency(selectedFood.reduce((total, food) => total + food.price * (food.quantity || 1), 0))}
                </span>
              </div>
            </div>
            <div className={cx('wrapper-total')}>
              <div></div>
              <div>
                <span>Phí giao dịch: {formatCurrency(transactionFee)} </span>
                <span>Thuế: {tax}% </span>
                <span>Tổng cộng tiền phải trả: {formatCurrency(totalAmountToPay)}</span>
              </div>
            </div>

            <button className={cx('button-createQR')} onClick={handleCreateQR}>
              Đặt vé
            </button>
          </div>
        </div>
      </section>

      <div className={cx('model', { active: isModelActive })}>
        <div className={cx('popup')}>
          <h3> QR thông tin vé đã đặt</h3>
          {qrData && (
            <QRCode
              value={JSON.stringify(qrData)}
              size={300}
              level="H"
              includeMargin={true}
              renderAs="svg"
              qrStyle="dots"
              enableCORS={true}
              qrVersion={40}
            />
          )}
          <button type="submit" className={cx('Btncheck-accept')} onClick={handleBooking}>
            Xác nhận đặt vé
          </button>
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

              <div className={cx('wrapper-showInfo-Film')}>
                {cinema && (
                  <div className={cx('box')}>
                    <span>Địa điểm Rạp</span>
                    <p>{cinema[0].location}</p>
                  </div>
                )}
                <div className={cx('showtime')}>
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
                    <p>{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className={cx('total-chair')}>
                <span>Ghế đã được chọn: </span>
                <span>{selectedSeats.join(', ')}</span>
              </div>
            </div>

            <div className={cx('actionButtons-checkout')}>
              <a href="" className={cx('btn-returnPage')}>
                Trở lại
              </a>
              <a href="" className={cx('btn-booking_qr')}>
                Đặt vé
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default CheckTicket;
