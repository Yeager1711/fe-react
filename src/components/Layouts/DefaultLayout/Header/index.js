import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.Module.scss';

//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header() {
  const [isAccountMenuVisible, setAccountMenuVisibility] = useState(false);
  const toggleAccountMenu = () => {
    setAccountMenuVisibility(!isAccountMenuVisible);
  };

  return (
    <header className={cx('wrapper')}>
      <a href="" className={cx('logo')}>
        {' '}
        MOVIE CINEMA
      </a>

      <nav className={cx('navbar')}>
        <a href="/">Trang chủ</a>
        <a href="/movieshowing">Phim đang chiếu</a>
        <a href="">Phim sắp chiếu</a>
        <a onClick={toggleAccountMenu}>
          <FontAwesomeIcon icon={faUser} />
        </a>

        {isAccountMenuVisible && (
          <div className={cx('account-menu')}>
            <a className={cx('btn-controller')} href="/authen/login">Login</a>
            <a className={cx('btn-controller')} href="/authen/register">Register</a>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
