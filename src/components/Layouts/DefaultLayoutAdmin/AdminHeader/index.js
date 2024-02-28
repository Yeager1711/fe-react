import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminHeader.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

function AdminHeader() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Gọi API để lấy thông tin người dùng
      fetch('http://localhost:5000/api/verify/current', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);

          // Lấy thông tin avatar sau khi có thông tin người dùng
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
            .catch((error) => console.error('Error fetching avatar data:', error));
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const mapRoleIdToName = () => {
    if (user && user.roleId) {
      switch (user.roleId) {
        case 1:
          return 'Admin';
        case 2:
          return 'Staff';
        case 3:
          return 'Client';
        default:
          return 'Unknown';
      }
    } else {
      return 'Unknown';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/authen/login';
  };

  return (
    <div className={cx('admin-header')}>
      <div className={cx('container-user')}>
        {user && (
          <>
            <div className={cx('image-user')}>
              <div className={cx('scale')}>
                {avatar && <img src={`data:image/png;base64,${avatar}`} alt="" />}
              </div>
            </div>

            <div className={cx('info-container')}>
              <span className={cx('name')}>{user.fullname}</span>
              <span className={cx('role')}>Role: {mapRoleIdToName()}</span>
            </div>
          </>
        )}
      </div>

      <nav className={cx('navbar-admin')}>
        <Link to="/admin/Home">Thông tin</Link>
        <Link to="/admin/manage-cinemas">Quản lý phòng vé</Link>
        <Link to="/admin/manage-movies">Quản lý phim</Link>
        <Link to="/admin/manage-screeningRate">Quản lý suất chiếu</Link>
      </nav>

      <div className={cx('logout')}>
        <button className={cx('btn-logout')} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
