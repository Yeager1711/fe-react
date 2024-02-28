import React, { useState } from 'react';
import styles from './Genre.scss';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const cx = classNames.bind(styles);

function AddGenre() {
    const [genreName, setGenreName] = useState('');
  
    const handleAddGenre = async () => {
      if (!genreName) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Vui lòng nhập tên thể loại',
          icon: 'error',
        });
        return;
      }
  
      // Hiển thị xác nhận từ người dùng
      const result = await Swal.fire({
        title: 'Xác nhận',
        text: `Bạn có muốn thêm thể loại "${genreName}" không?`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        confirmButtonText: 'OK',
      });
  
      // Nếu người dùng nhấn "OK", thực hiện thêm thể loại
      if (result.isConfirmed) {
        try {
          const responseGenre = await axios.post('http://localhost:5000/api/genre/addAddgenre', { name: genreName });
  
          Swal.fire({
            title: 'Thành công',
            text: `Thể loại "${genreName}" đã được thêm thành công!`,
            icon: 'success',
          });
  
          // Reset giá trị của input
          setGenreName('');
        } catch (error) {
          console.error('Error adding genre:', error);
  
          Swal.fire({
            title: 'Lỗi',
            text: 'Có lỗi xảy ra khi thêm thể loại',
            icon: 'error',
          });
        }
      }
    };

  return (
    <div className={cx('add-genre')}>
      <div className={cx('button-controllers')}>
        <a>Admin </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a href="/admin/home">Home </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a>Add Genre </a>
      </div>

      <div className={cx('addGenre-container')}>
        <h3>Thêm thể loại film</h3>
        <div className={cx('genre-input')}>
          <input
            type="text"
            name=""
            placeholder="Nhập thể loại film..."
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
          />
          <button type="button" className={cx('btn-Addgenre')} onClick={handleAddGenre}>
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddGenre;
