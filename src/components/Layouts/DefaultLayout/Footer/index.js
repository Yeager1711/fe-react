import React from "react";
import classNames from "classnames";
import styles from './Footer.scss';

const cx = classNames.bind(styles);

function CustomFooter() {
  return (
    <footer className={cx('Footer')}>
      Footer
    </footer>
  );
}

export default CustomFooter;
