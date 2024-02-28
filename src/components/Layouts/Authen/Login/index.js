import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Login.scss';
import axios from 'axios';

const cx = classNames.bind(styles);

function Login() {
  const [formLogin, setFormLogin] = useState({
    username: '',
    password: '',
    error: '', // Thêm state error để hiển thị thông báo lỗi dưới các trường nhập liệu
    showErrorShake: false // Thêm state để xác định liệu có hiển thị hiệu ứng rung rung hay không
  });
  
  const history = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormLogin({ ...formLogin, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const { username, password, showErrorShake } = formLogin;

      if (!username || !password) {
        setFormLogin({ ...formLogin, error: 'Vui lòng nhập tên đăng nhập và mật khẩu.', showErrorShake: false });
        return;
      }

      const responseLogin = await axios.post('http://localhost:5000/api/authen/api/login', {
        username: username,
        password: password,
      });

      if (responseLogin.status === 200) {
        const { role_id, tokenAuth } = responseLogin.data;

        if (role_id === 1 ||  role_id === 2) {
          history('/admin/Home');
        } else if (role_id === 3) {
          history('/');
        }

        localStorage.setItem('token', tokenAuth);
      }
    } catch (error) {
      console.error('Failed to login:', error);

      if (error.response && error.response.status === 401) {
        setFormLogin({ ...formLogin, error: 'Tên đăng nhập hoặc mật khẩu không đúng.', showErrorShake: true });
      } else {
        setFormLogin({ ...formLogin, error: 'Có lỗi xảy ra trong quá trình đăng nhập.', showErrorShake: false });
      }
    }
  };

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
          <div className={cx('box-input', { 'shake': formLogin.showErrorShake && formLogin.error !== '' })}>
            <span>Tên đăng nhập</span>
            <input type="text" name="username" onChange={handleInput} placeholder="Enter your username" />
          </div>

          <div className={cx('box-input', { 'shake': formLogin.showErrorShake && formLogin.error !== '' })}>
            <span>Mật khẩu</span>
            <input type="password" name="password" onChange={handleInput} placeholder="Enter your password" />
          </div>

          {/* Hiển thị thông báo lỗi dưới các trường nhập liệu */}
          {formLogin.error && <div className={cx('error-valid')}>{formLogin.error}</div>}

          <div className={cx('authen-connect')}>
            <button type="submit" className={cx('button-correct')} onClick={handleLogin}>
              Đăng nhập
            </button>
            <a href="/authen/register"> Đăng ký</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
