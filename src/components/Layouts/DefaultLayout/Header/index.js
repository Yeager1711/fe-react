import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.Module.scss';

// fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:5000/api/verify/current', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.log('Error fetching user data'));

      fetch('http://localhost:5000/api/verify/avatar', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((avatarData) => {
          setAvatar(avatarData.avatar);
        })
        .catch((error) => console.log('Error fetching avatar data'));
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAvatar(null);
    window.location.href = '/authen/login';
  };

  return (
    <header className={cx('wrapper')}>
      <Link to="/" className={cx('logo')}>
        Movies<span>Flix</span>
      </Link>

      <nav className={cx('navbar')}>
        <Link to="/">Trang chủ</Link>
        <Link to="/movieshowing">Phim chiếu</Link>
        <Link to="/search">Tìm kiếm</Link>
        {user ? (
          <div className={cx('user-info')} onClick={toggleDropdown}>
            <img src={`data:image/png;base64,${avatar}`} alt="Avatar" className={cx('avatar')} />
            <span className={cx('fullname')}>{user.fullname}</span>
            {isDropdownOpen && (
              <div className={cx('dropdown')}>
                <Link to={`/my-account/profile/${user.username}`} className={cx('btn-info')}>Thông tin người dùng</Link>
                <button onClick={handleLogout} className={cx('logout-btn')}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/authen/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
