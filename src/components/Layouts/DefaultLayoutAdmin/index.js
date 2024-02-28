// DefaultLayoutAdmin.js
import React from 'react';
import AdminHeader from './AdminHeader';

import classNames from 'classnames';
import styles from './DefaultAdmin.scss'
const cx = classNames.bind(styles);

const DefaultLayoutAdmin = ({ children }) => {
  return (
    <section className={cx('wrapper-admin')}>
      <div className={cx('header')}>
        <AdminHeader />
      </div>
      <div className={cx('container-admin')}>
      {children}    
      </div>
      
    </section>
  );
};

export default DefaultLayoutAdmin;
