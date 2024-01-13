import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/autoplay';
import classNames from 'classnames/bind';
import styles from './Home.Module.scss';

const cx = classNames.bind(styles);

// Cài đặt các thành phần Swiper
// SwiperCore.use([Navigation, Pagination, Mousewheel, Keyboard, Autoplay]);

const Home = () => {
  return (
    <div className={cx('home')}>
      <Swiper
        className="mySwiper"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination
        mousewheel
        keyboard
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className={cx('home-wrapper')}>
            <div className={cx('image-wrapper')}>
              <img src="./images/poster-1.jpg" alt="" />
              <div className={cx('content-image')}>
                <div className={cx('content')}>
                  <h3>doctor strange 2</h3>
                  <span>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum."
                  </span>
                  <div className={cx('button-choose')}>
                    <button className={cx('btn-booking')}>Booking now</button>
                    <button className={cx('btn-watch')}>Watch Trailer</button>
                  </div>
                </div>
                <div className={cx('image-ct')}>
                  <img src="./images/poster-11.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className={cx('home-wrapper')}>
            <div className={cx('image-wrapper')}>
              <img src="./images/poster-2.jpg" alt="" />
              <div className={cx('content-image')}>
                <div className={cx('content')}>
                  <h3>Spiderman</h3>
                  <span>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim id est laborum."
                  </span>
                  <div className={cx('button-choose')}>
                    <button className={cx('btn-booking')}>Booking now</button>
                    <button className={cx('btn-watch')}>Watch Trailer</button>
                  </div>
                </div>
                <div className={cx('image-ct')}>
                  <img src="./images/poster-12.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className={cx('home-wrapper')}>
            <div className={cx('image-wrapper')}>
              <img src="./images/poster-3.jpeg" alt="" />
              <div className={cx('content-image')}>
                <div className={cx('content')}>
                  <h3>Caption AMERICA</h3>
                  <span>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim id est laborum."
                  </span>
                  <div className={cx('button-choose')}>
                    <button className={cx('btn-booking')}>Booking now</button>
                    <button className={cx('btn-watch')}>Watch Trailer</button>
                  </div>
                </div>
                <div className={cx('image-ct')}>
                  <img src="./images/poster-13.webp" alt="" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;
