import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Register.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Register() {
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
            <label className={cx('box-images')} htmlFor="fileInput">
              Chọn ảnh
              <input id="fileInput" type="file" style={{ display: 'none' }} />
            </label>
          </div>

          <div className={cx('box')}>
            <div className={cx('box-input-flex')}>
              <span>Họ và tên</span>
              <input type="text" name="" placeholder="Enter your fullname" />
            </div>

            <div className={cx('box-input-flex')}>
              <span>Số điện thoại</span>
              <input type="text" name="" placeholder="Enter your phonenumber" />
            </div>
          </div>

          <div className={cx('box')}>
            <div className={cx('box-input-flex')}>
              <span>Email</span>
              <input type="text" name="" placeholder="Enter your email" />
            </div>

            <div className={cx('box-input-flex')}>
              <span>Giới tính</span>
              <input type="text" name="" placeholder="Enter your gender" />
            </div>
          </div>

          <div className={cx('box-input')}>
            <span>Tên đăng nhập</span>
            <input type="text" name="" placeholder="Enter your username" />
          </div>

          <div className={cx('box-input')}>
            <span>Mật khẩu</span>
            <input type="password" name="" placeholder="Enter your password" />
          </div>

          <div className={cx('box-input')}>
            <span>Xác nhận mật khẩu</span>
            <input type="confirm-password" name="" placeholder="Enter your confirm password" />
          </div>

          <div className={cx('authen-connect')}>
            <button type='submit' className={cx('button-correct')}>Đăng ký</button>
            <a href="/authen/login"> Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
