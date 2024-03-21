import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './BookingHistory.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const cx = classNames.bind(styles);

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

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
    const token = localStorage.getItem('token');
    const userId = user && user.userId;

    if (token && userId) {
      axios
        .get(`${apiUrl}/booking/getBooking/${userId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const mergedBookings = mergeSeatInfo(response.data.bookings);
          mergedBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
          setBookings(mergedBookings);
        })
        .catch((error) => {
          console.error('Error fetching booking data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to fetch booking data. Please try again later.',
          });
        });
    }
  }, [user]);

  // Hàm gộp thông tin ghế khi screeningId trùng nhau
  const mergeSeatInfo = (bookings) => {
    const mergedBookings = {};
    bookings.forEach((booking) => {
      if (booking.screeningId in mergedBookings) {
        mergedBookings[booking.screeningId].seatInfo += `, ${convertSeatNumberToChar(
          booking.rowNumber,
          booking.seatNumber,
        )}`;
      } else {
        mergedBookings[booking.screeningId] = { ...booking };
        mergedBookings[booking.screeningId].seatInfo = convertSeatNumberToChar(booking.rowNumber, booking.seatNumber);
      }
    });
    return Object.values(mergedBookings);
  };

  function decodedImageBase64(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  // Hàm chuyển đổi số ghế thành ký tự và số ghế
  const convertSeatNumberToChar = (rowNumber, seatNumber) => {
    const row = String.fromCharCode(65 + rowNumber - 1);
    return `${row}${seatNumber}`;
  };

  return (
    <div className={cx('booking')}>
      <div className={cx('booking-container')}>
        <h3 className={cx('title')}>Thông tin đặt vé của tôi</h3>

        <div className={cx('page-tabs')}>
          <Link className={cx('info')} to={`/my-account/profile/:username`}>
            Hồ sơ
          </Link>
          <span className={cx('history-ticket')}>Lịch sử đặt vé</span>
        </div>

        <div className={cx('wrapper-ticketBooking')}>
          {bookings.length === 0 ? (
            <div className={cx('historyTicket-container')}>
              <span className={cx('null-ticket')}>Bạn chưa có lịch sử đặt vé nào!</span>
            </div>
          ) : (
            bookings.map((booking, index) => (
              <div className={cx('box-ticket')} key={index}>
                <div className={cx('image-film')}>
                  <img src={decodedImageBase64(booking.movieImage)} alt="Movie Poster" />
                </div>

                <div className={cx('info')}>
                  <span>
                    Tên phim: <p>{booking.movieName}</p>{' '}
                  </span>
                  <span>
                    Địa điểm: <p>{booking.location}</p>{' '}
                  </span>
                  <span>
                    Phòng:<p>{booking.roomName}</p>{' '}
                  </span>
                  <span className={cx('time-run')}>
                    Bắt đầu:
                    <p>
                    {new Date(booking.startTime).getHours()}h
                      {new Date(booking.startTime).getMinutes()}, 
                    </p>
                    <p>
                    ({new Date(booking.startTime).getDate()}/{new Date(booking.startTime).getMonth() + 1}/
                      {new Date(booking.startTime).getFullYear()})
                      
                    </p>
                  </span>



                  <span>
                    Ghế:<p>{booking.seatInfo}</p>{' '}
                  </span>
                  <span>
                    Combo đã chọn: <p>{booking.comboName}</p>{' '}
                  </span>

                  <span>
                    Tổng tiền: <p>{formatCurrency(booking.bookingTotalAmount)}</p>{' '}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
