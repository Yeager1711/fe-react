import React, { useState, useEffect } from 'react';
import styles from './ScreeningRate.scss';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const cx = classNames.bind(styles);

function ScreeningRate() {
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

  useEffect(() => {
    const updateActiveSpan = () => {
      const spans = document.querySelectorAll('.time-rate span');
      const currentTime = new Date();
      
      spans.forEach(span => {
        const [hours, minutes] = span.textContent.split(':').map(val => parseInt(val));
        const spanTime = new Date();
        spanTime.setHours(hours);
        spanTime.setMinutes(minutes);
        
        if (spanTime < currentTime) {
          span.classList.add('active');
        } else {
          span.classList.remove('active');
        }
      });
    };
    
    updateActiveSpan();
    const intervalId = setInterval(updateActiveSpan, 60000); 
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [roomInfo]);

  // Function to handle room creation
  

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

        
      </div>

      {Array.isArray(roomInfo) && roomInfo.length > 0 && (
        <div className={cx('screeningrate-container')}>
          {roomInfo.map((room) => (
            <div key={room.roomId} className={cx('cinemas')}>
              <div className={cx('info-room')}>
                <span className={cx('name-cinemas')}>Tên phòng: <p>{room.roomName}</p></span>
                <span className={cx('name-nowShowing')}>Phim đang chiếu: DUNE: PART TWO</span>
              </div>

              <div className={cx('time-rate')}>
                <span>9:30</span>
                <span>10:00</span>
                <span>10:30</span>
                <span>11:00</span>
                <span>11:30</span>
                <span>12:00</span>
                <span>12:30</span>
                <span>13:00</span>
                <span>13:30</span>
                <span>14:00</span>
                <span>14:30</span>
                <span>15:00</span>
                <span>15:30</span>
                <span>16:00</span>
                <span>16:30</span>
                <span>17:00</span>
                <span>17:30</span>
                <span>18:00</span>
                <span>18:30</span>
                <span>19:00</span>
                <span>19:30</span>
                <span>20:00</span>
                <span>20:30</span>
                <span>21:00</span>
                <span>21:30</span>
                <span>22:00</span>
                <span>22:30</span>
                <span>23:00</span>
                <span>23:30</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScreeningRate;
