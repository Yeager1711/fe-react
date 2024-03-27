import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Register.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

const cx = classNames.bind(styles);

function Register() {

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  const [formData, setFormData] = useState({
    fullname: '',
    phonenumber: '',
    email: '',
    gender: '',
    username: '',
    password: '',
    confirmpass: '',
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isImageSelected, setisImageSelected] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, avatar: file });
      setisImageSelected(true);
    } else {
      setisImageSelected(false);
    }
  };

  const handleRegister = async () => {
    try {
      const { fullname, phonenumber, email, gender, username, password, confirmpass, avatar } = formData;

      if (!fullname || !phonenumber || !email || !gender || !username || !password || !confirmpass || !avatar) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Vui lòng thêm đầy đủ thông tin.',
        });
        return;
      }

      if (password !== confirmpass) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Xác nhận mật khẩu không khớp.',
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('fullname', fullname);
      formDataToSend.append('phonenumber', phonenumber);
      formDataToSend.append('email', email);
      formDataToSend.append('gender', gender);
      formDataToSend.append('username', username);
      formDataToSend.append('password', password);
      formDataToSend.append('avatar', avatar);

      const responseRegister = await axios.post(`${apiUrl}/authen/api/register`, formDataToSend);
      console.log('Data to send:', formDataToSend);
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Bạn đã đăng ký tài khoản thành công.',
      }).then(() => {
        window.location.reload();
      });;
    } catch (error) {
      console.error('Failed to register:', error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === 'Email already exists') {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: 'Email đã tồn tại.',
          })
        } else if (error.response.data.error === 'Username already exists') {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: 'Tên đăng nhập đã tồn tại.',
          })
        } else if (error.response.data.error === 'Phone number already exists') {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: 'Số điện thoại đã tồn tại.',
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: 'Có lỗi xảy ra trong quá trình đăng ký.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng ký thất bại!',
          text: 'Có lỗi xảy ra trong quá trình đăng ký.',
        });
      }
      
    }
  };

  return (
    <div className={cx('wrapper-register')}>
      <div className={cx('register-container')}>
        <div className={cx('title')}>
          <h3>Register</h3>
          <span>
            Băng cách đăng ký hoặc <a href="/authen/register"> đăng nhập </a> để trải nghiệm
          </span>
        </div>

        <div className={cx('container')}>
          <div className={cx('box')}>
            <label className={cx('box-images', { 'image-selected': isImageSelected })} htmlFor="fileInput">
              {isImageSelected ? 'Ảnh đã được chọn' : 'Chọn ảnh'}
              <input id="fileInput" name="avatar" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className={cx('box')}>
            <div className={cx('box-input-flex')}>
              <span>Họ và tên</span>
              <input
                type="text"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
                placeholder="Enter your fullname"
              />
            </div>

            <div className={cx('box-input-flex')}>
              <span>Số điện thoại</span>
              <input
                type="text"
                value={formData.phonenumber}
                name="phonenumber"
                onChange={handleInputChange}
                placeholder="Enter your phonenumber"
              />
            </div>
          </div>

          <div className={cx('box')}>
            <div className={cx('box-input-flex')}>
              <span>Email</span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div className={cx('box-input-flex')}>
              <span>Giới tính</span>
              <select name="gender" onChange={handleInputChange} value={formData.gender}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className={cx('box-input')}>
            <span>Tên đăng nhập</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </div>

          <div className={cx('box-input')}>
            <span>Mật khẩu</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>

          <div className={cx('box-input')}>
            <span>Xác nhận mật khẩu</span>
            <input
              type="password"
              name="confirmpass"
              value={formData.confirmpass}
              onChange={handleInputChange}
              placeholder="Enter your confirm password"
            />
          </div>

          <div className={cx('authen-connect')}>
            <button type="submit" className={cx('button-correct')} onClick={handleRegister}>
              Đăng ký
            </button>
            <a href="/authen/login"> Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
