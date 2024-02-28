import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import styles from './Profile.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [temporaryAvatar, setTemporaryAvatar] = useState(null); // State để lưu trữ URL của ảnh tạm thời
  const fileInputRef = useRef(null);
  const [fullnameInput, setFullnameInput] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:5000/api/verify/current', {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUser(response.data);
          axios
            .get('http://localhost:5000/api/verify/avatar', {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Mật khẩu mới và xác nhận mật khẩu không khớp. Vui lòng nhập lại.',
      });
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      const passwordData = { userId: user.userId, newPassword };

      axios
        .post('http://localhost:5000/api/user/repassword', passwordData, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data);
          setError('');
          Swal.fire({
            icon: 'success',
            title: 'Đổi mật khẩu thành công!',
            showConfirmButton: false,
            timer: 1500,
          });
          setNewPassword('');
          setConfirmPassword('');
        })
        .catch((error) => {
          console.error('Error changing password:', error);
          setError('Đã xảy ra lỗi khi đổi mật khẩu.');
          Swal.fire({
            icon: 'error',
            title: 'Đã xảy ra lỗi!',
            text: 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.',
          });
        });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setTemporaryAvatar(url);
  };

  const handleLabelClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const formData = new FormData();
      const tokenData = JSON.parse(atob(token.split('.')[1])); 
      formData.append('userId', tokenData.userId);
      formData.append('fullname', tokenData.fullname); 
      if (temporaryAvatar !== null) { 
        formData.append('avatar', temporaryAvatar); 
      }
  
      axios
        .post('http://localhost:5000/api/user/updateInfo', formData, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data', 
          },
        })
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thông tin thành công!',
            showConfirmButton: false,
            timer: 1500,
          });
          
          setUser((prevState) => ({
            ...prevState,
            avatar: temporaryAvatar, 
          }));
        })
        .catch((error) => {
          console.error('Error updating user info:', error);
          Swal.fire({
            icon: 'error',
            title: 'Đã xảy ra lỗi!',
            text: 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.',
          });
        });
    }
  };
  

  return (
    <div className={cx('profile')}>
      <div className={cx('profile-container')}>
        <h3 className={cx('title')}>Tài khoản của tôi</h3>

        <div className={cx('page-tabs')}>
          <span className={cx('info', { active: activeTab === 'info' })} onClick={() => handleTabChange('info')}>
            Hồ sơ
          </span>
          <span
            className={cx('history-ticket', { active: activeTab === 'ticket' })}
            onClick={() => handleTabChange('ticket')}
          >
            Lịch sử đặt vé
          </span>
        </div>

        {activeTab === 'info' && (
          <div className={cx('wrapper-info')}>
            <div className={cx('editInfo-container')}>
              <h3>Thông tin cá nhân</h3>
              <div className={cx('info-image')}>
                {temporaryAvatar ? (
                  <img src={temporaryAvatar} alt="Avatar" className={cx('avatar')} />
                ) : (
                  <img src={`data:image/png;base64,${avatar}`} alt="Avatar" className={cx('avatar')} />
                )}
                <div className={cx('btn-changeImage ')}>
                  <div className={cx('btn-center')}>
                    <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                    <label htmlFor="fileInput" className="camera-icon" onClick={handleLabelClick}>
                      <FontAwesomeIcon icon={faCamera} />
                    </label>
                  </div>
                </div>
              </div>
              <div className={cx('wrap-box')}>
                <div className={cx('box')}>
                  <span>Họ và tên</span>
                  <input placeholder="Nam Huynh" defaultValue={user && user.fullname} />
                </div>
                <div className={cx('box')}>
                  <span>Giới tính</span>
                  <input placeholder="Nam" defaultValue={user && user.gender} disabled/>
                </div>
                <div className={cx('box')}>
                  <span>Email</span>
                  <input placeholder="namhp1711@gmail.com" defaultValue={user && user.email} disabled />
                </div>
                <div className={cx('box')}>
                  <span>Số điện thoại</span>
                  <input placeholder="0333409892" defaultValue={user && user.phonenumber} disabled />
                </div>
              </div>
              <button type="submit" className={cx('btn-changes')} onClick={handleSaveChanges}>
                Lưu thay đổi
              </button>
            </div>

            <div className={cx('repass-container')}>
              <h3>Đổi mật khẩu</h3>
              <div className={cx('wrap-box')}>
                <div className={cx('box')}>
                  <span>Mật khẩu mới</span>
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className={cx('box')}>
                  <span>Xác nhận mật khẩu</span>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className={cx('btn-changesRepass')} onClick={handleChangePassword}>
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div className={cx('wrapper-ticket')}>
            <div className={cx('historyTicket-container')}>
              <span className={cx('null-ticket')}>Bạn chưa có lịch sử đặt vé nào !</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
