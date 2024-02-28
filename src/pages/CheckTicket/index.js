import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './CheckTicket.scss';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import QRCode from 'qrcode.react';

const cx = classNames.bind(styles);

function CheckTicket() {
  const totalSeats = 12;
  const priceSeatDefault = 75000;

  //combo food
  const popcorn = 65000;
  const popcornWater = 95000;
  const popcornWaterDouble = 115000;

  const seatsTotal = totalSeats * priceSeatDefault;
  const [selectedSeatsCount, setSelectedSeatsCount] = useState(seatsTotal); // Thay đổi giá trị này tùy theo số ghế đã chọn
  const [selectedFoodTotal, setSelectedFoodTotal] = useState(0); // Thay đổi giá trị này tùy theo số tiền đồ ăn đã chọn
  const transactionFee = 0; // Phí giao dịch, thay đổi nếu có
  const taxRate = 10;

  // Tính tổng số tiền cần thanh toán
  const totalAmount = selectedSeatsCount + selectedFoodTotal + transactionFee;
  const taxAmount = totalAmount * (taxRate / 100); // Chia cho 100 để tính %
  const finalAmount = totalAmount + taxAmount + popcornWaterDouble;

  // state xác định khi nào hiển thị mã QR
  const [showQR, setShowQR] = useState(false);

  // data for QR
  const qrData = {
    filmName: 'DUNE: PART TWO',
    showtime: '23:00',
    seatCount: '60',
    selectedSeats: ['A1', 'B2', 'C3'],
    cinemaLocation: 'Quận 9, Tp. Thủ Đức',
    totalAmount: finalAmount,
  };

  // convert data to JSON string
  const qrDataString = JSON.stringify(qrData);

  const handleCreateQR = () => {
    // Hiển thị mã QR
    setShowQR(true);

    // Hiển thị thông báo
    Swal.fire({
      icon: 'success',
      text: 'Mã Booking đã được tạo!',
    });
  };

  return (
    <section className={cx('wrapper-setTicket')}>
      <section className={cx('setTick-wrapper')}>
        <h2 className={cx('setTick-title')}> Checkout Booking </h2>

        <div className={cx('setTick-container')}>
          <div className={cx('user-container')}>
            <span>
              Tài khoản:
              <p>namhp1711@gmail.com</p>
            </span>

            <div className={cx('info-container')}>
              <div className={cx('box')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="71" height="62"><g fill="#fff" fill-rule="evenodd"><path d="M35 0l-1.899 5.715L27 5.73l4.926 3.547L30.056 15 35 11.478 39.945 15l-1.871-5.723L43 5.73l-6.099-.015z"/><path d="M59.484 27.975c.096 0 .165.042.205.137l1.688 3.373h.041l1.688-3.373c.042-.095.11-.137.206-.137h1.73c.096 0 .136.07.096.137l-2.759 5.427v3.55c0 .082-.054.137-.138.137H60.5c-.082 0-.137-.055-.137-.137v-3.55l-2.76-5.427c-.026-.068 0-.137.097-.137h1.785zm-3.542 9.25h-1.949c-.123 0-.165-.04-.206-.136l-1.605-3.387h-1.249c-.055 0-.082.028-.082.082v3.305c0 .082-.055.137-.137.137H48.97c-.082 0-.136-.055-.136-.137v-8.977c0-.083.054-.137.136-.137h3.72c1.906 0 3.17 1.184 3.17 2.871 0 1.183-.632 2.122-1.66 2.57l1.838 3.647c.042.081 0 .163-.096.163zM35.437 55.19l-9.715-14.392h19.43L35.437 55.19zm-17.455-18.1c0 .082-.055.137-.138.137h-1.742c-.082 0-.139-.055-.139-.137v-8.977c0-.083.057-.137.14-.137h1.74c.084 0 .14.054.14.137v8.977zm-7.52.137H8.869c-.096 0-.15-.055-.178-.137l-2.964-8.965c-.027-.095.026-.15.122-.15h1.784c.097 0 .151.043.18.138l1.867 6.066h.041l1.81-6.066c.029-.095.082-.137.18-.137h1.769c.084 0 .137.054.111.15l-2.965 8.964c-.027.082-.082.137-.164.137zM7.046 13.129h12.55l7.634 11.275H14.657l-7.61-11.275zm16 21.457c.205.639.673 1.02 1.4 1.02.782 0 1.221-.45 1.481-1.047.043-.08.111-.108.192-.069l1.497.666c.082.029.11.097.068.164-.52 1.293-1.673 2.055-3.251 2.055-1.634 0-2.828-.762-3.322-2.271-.206-.6-.26-1.076-.26-2.503 0-1.429.054-1.905.26-2.503.494-1.51 1.688-2.271 3.322-2.271 1.578 0 2.73.761 3.251 2.054.042.068.014.135-.068.162l-1.497.667c-.08.04-.15.013-.192-.068-.26-.6-.699-1.048-1.48-1.048-.728 0-1.196.382-1.401 1.02-.11.34-.15.667-.15 1.987 0 1.319.04 1.645.15 1.985zm13.49-6.611c.083 0 .138.054.138.137v1.51c0 .08-.055.135-.137.135h-2.362c-.053 0-.08.029-.08.082v7.25c0 .082-.055.137-.138.137h-1.743c-.082 0-.138-.055-.138-.137v-7.25c0-.053-.026-.082-.08-.082h-2.362c-.082 0-.138-.055-.138-.135v-1.51c0-.083.056-.137.138-.137h6.903zm9.168 7.156c-.48 1.497-1.77 2.244-3.403 2.244-1.635 0-2.924-.747-3.403-2.244-.206-.64-.26-1.156-.26-2.53 0-1.374.054-1.89.26-2.53.48-1.498 1.768-2.244 3.403-2.244 1.633 0 2.923.746 3.403 2.244.206.64.26 1.156.26 2.53 0 1.374-.054 1.89-.26 2.53zm5.571-22.002h12.553l-7.612 11.275H43.642l7.633-11.275zm19.598-3.731H49.268L39.111 24.404h-7.349L21.605 9.398H0l10.13 15.006H2.19v16.393h19.003l14.244 21.1 14.243-21.1h19.003V24.404h-7.938L70.873 9.398z"/><path d="M42.301 29.594c-.768 0-1.263.382-1.469 1.021-.11.326-.15.775-.15 1.986 0 1.21.04 1.66.15 1.985.206.639.701 1.02 1.47 1.02.767 0 1.261-.381 1.467-1.02.11-.325.15-.775.15-1.985 0-1.211-.04-1.66-.15-1.986-.206-.639-.7-1.021-1.468-1.021m11.541 1.252c0-.695-.494-1.144-1.262-1.144h-1.647c-.055 0-.082.028-.082.084v2.134c0 .054.027.081.082.081h1.647c.768 0 1.262-.448 1.262-1.155"/></g></svg>
                <p className={cx('name-user')}> Huỳnh Nam</p>
              </div>
            </div>
          </div>

          <div className={cx('food-container')}>
            <h3 className={cx('setTick-foodTitle')}>Chọn đồ ăn</h3>

            <div className={cx('container')}>
              <div className={cx('box')}>
                <img src='./images/popcorn.png'  alt='' />

                <span className={cx('combo-food')}>x1 Bắp</span>
                <span className={cx('combo-price')}>{popcorn}đ</span>

                <button className={cx('choose')}>chọn</button>
              </div>

              <div className={cx('box')}>
                <img src='./images/popcorn-water.png'  alt='' />

                <span className={cx('combo-food')}>Combo (bắp, nước)</span>
                <span className={cx('combo-price')}>{popcornWater} đ</span>

                <button className={cx('choose')}>chọn</button>
              </div>

              <div className={cx('box')}>
                <img src='./images/popcorn-waterdouble.png'  alt='' />

                <span className={cx('combo-food')}>Combo (1 Bắp, 2 nước)</span>
                <span className={cx('combo-price')}>{popcornWaterDouble} đ</span>

                <button className={cx('choose')}>chọn</button>
              </div>

              
            </div>
          </div>

          <div className={cx('reviewOrder-container')}>
            <h3 className={cx('setTick-orderTitle')}>Xem lại đơn đặt của bạn</h3>
            <div className={cx('wrapper-order')}>
              <div className={cx('price-seats')}>
                <span>12 Ghế đã chọn</span>
                <span>900.000đ</span>
              </div>

              <div className={cx('price-food')}>
                <span> Đồ ăn đã chọn </span>
                <span> Combo (1 Bắp, 2 nước) </span>
                <span>115.000đ</span>
              </div>
            </div>
            <div className={cx('wrapper-total')}>
              <div></div>
              <div>
                <span>Phí giao dịch: {transactionFee.toLocaleString()}đ</span>
                <span>
                  Thuế ({(taxRate * 100).toFixed(0)}%): {taxAmount.toLocaleString()}đ
                </span>
                <span>Tổng cộng tiền phải trả: {finalAmount.toLocaleString()}đ</span>
              </div>
            </div>

            <button className={cx('button-createQR')} onClick={handleCreateQR}>
              Tạo QR Booking
            </button>
          </div>

          <div className={cx('created-Qr')}>{showQR && <QRCode value={qrDataString} />}</div>
        </div>
      </section>

      <section className={cx('additional-components')}>
        <section className={cx('showtime-wrapper')}>
          <div className={cx('showtime-container')}>
            <div className={cx('image-film')}>
              <img src="./images/film-1.png" alt="" />
            </div>

            <div className={cx('center')}>
              <h3>Tên phim</h3>
              <span>DUNE: PART TWO</span>

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
                  {/* <p>{quantity} vé</p> */}
                  <p>60 vé</p>
                </div>

                <div className={cx('box')}>
                  <span>Tổng số tiền</span>
                  {/* <p>{formattedPrice}</p>  */}
                  <p>1.200.000</p>
                </div>
              </div>

              <div className={cx('total-chair')}>
                <span>Ghế đã được chọn: </span>
                {/* {quantity > 0 && <span>{selectedSeats ? selectedSeats.join(', ') : ''}</span>} */}
              </div>
            </div>

            <div className={cx('actionButtons-checkout')}>
              <a href="/show">Trở lại</a>
              <a href="/check-ticket">Kiểm tra</a>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}

export default CheckTicket;
