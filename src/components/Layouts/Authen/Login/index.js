import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Login() {
  return (
    <div className={cx('wrapper-login')}>
      <div className={cx('login-container')}>
        <div className={cx('title')}>
          <h3>Login</h3>
          <span>
            Băng cách đăng nhập hoặc <a href="/authen/register"> đăng ký </a> để trải nghiệm
          </span>
        </div>

        <div className={cx('container')}>
          <div className={cx('box-input')}>
            <span>Tên đăng nhập</span>
            <input
              type="text"
              name=""
              placeholder="Enter your username"
            />
          </div>

          <div className={cx('box-input')}>
            <span>Mật khẩu</span>
            <input
              type='password'
              name=''
              placeholder='Enter your password'
            />
          </div>

          <div className={cx('authen-connect')}>
            <button type='submit' className={cx('button-correct')}>Đăng nhập</button>
            <a href="/authen/register"> Đăng ký</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
