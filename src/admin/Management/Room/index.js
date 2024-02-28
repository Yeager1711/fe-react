import React, { useState, useEffect } from 'react';
import styles from './Room.scss';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const cx = classNames.bind(styles);

function Cinemas() {
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/getRoom');
        console.log('Response data:', response.data);

        setRoomInfo(response.data);
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

  // Function to handle room creation
  const createRoom = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/rooms/createroom', { cinemaId: 1, roomNumber: 1 });
      console.log('Response data:', response.data);

      if (response.data.success) {
        const { roomName, totalSeats } = response.data;
        console.log('Room name:', roomName);
        console.log('Total seats:', totalSeats);
        setRoomInfo({ roomName, totalSeats });

        Swal.fire(
          {
            title: 'Phòng đã được tạo thành công!',
            icon: 'success',
          },
          setTimeout(() => {
            window.location.reload();
          }, 1300),
        );
      } else {
        Swal.fire({
          title: 'Lỗi!',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi tạo phòng.',
        icon: 'error',
      });
    }
  };

  return (
    <div className={cx('cinemas')}>
      <div className={cx('button-controllers')}>
        <div>
          <a>Admin </a>
          <FontAwesomeIcon icon={faChevronRight} />
          <a href="/admin/home">Home </a>
          <FontAwesomeIcon icon={faChevronRight} />
          <a>Cinemas</a>
        </div>

        <div>
          <button onClick={createRoom}>Tạo phòng</button>
        </div>
      </div>

      {Array.isArray(roomInfo) && roomInfo.length > 0 && (
        <div className={cx('cinemas-container')}>
          {roomInfo.map((room) => (
            <div key={room.roomId} className={cx('cinemas')}>
              <div className={cx('info-room')}>
                <span className={cx('name-cinemas')}>Tên phòng: <p>{room.roomName}</p></span>
                <span className={cx('total-seats')}>Số lượng ghế: <p>{room.totalSeats}</p></span>
              </div>

              <div className={cx('seat-selected')}>
                <span>
                  <FontAwesomeIcon icon={faCouch} />
                  <p>0</p>/{room.totalSeats}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cinemas;
