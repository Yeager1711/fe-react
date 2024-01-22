import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './SetChair.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

function SetChair() {
  const alphabet = Array.from({ length: 6 }, (_, index) => String.fromCharCode(65 + index)); // A-H
  const seatsPerRow = 12; // Số lượng ghế mỗi hàng

  // Tạo mảng chứa các hàng và ghế
  const rows = alphabet.map((letter, rowIndex) => (
    <div key={rowIndex} className={cx('row')}>
      <div className={cx('column-letter')}>
        <span>{letter}</span>
      </div>
      {Array.from({ length: seatsPerRow }, (seat, seatIndex) => {
        const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
        return (
          <div key={seatIndex} className={cx('chair')}>
            <FontAwesomeIcon icon={faCouch} />
            <p>{`${letter}${seatNumber}`}</p>
          </div>
        );
      })}
    </div>
  ));

  return (
    <div className={cx('setChair-wrapper')}>
      <div className={cx('setChair-container')}>
        <div className={cx('screen-chair')}>
          <div className={cx('screen')}>
            <span>Màn hình</span>
          </div>

          <div className={cx('entrance')}>
            Lối vào
          </div>

          <div className={cx('chairs')}>{rows}</div>

          <div className={cx('cinema-note')}>
                <p><FontAwesomeIcon icon={faCouch} />Ghế chưa đặt <FontAwesomeIcon icon={faCheck} /></p>
                <p><FontAwesomeIcon icon={faCouch} />Ghế đã được đặt <FontAwesomeIcon icon={faTimes} /></p>
          </div>

          <div className={cx('controll-btn')}>
               <a href='/' className={cx('btn-backgTopage')}> Trở lại</a>
               <a href='/' className={cx('btn-buys')}> Mua đồ ăn</a>
               <a href='/' className={cx('btn-ticket')}> Tạo vé !</a>
               
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetChair;
