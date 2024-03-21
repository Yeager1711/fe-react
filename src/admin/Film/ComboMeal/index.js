import React, { useState, useEffect } from 'react';
import styles from './ComboMeal.scss';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ComboMeal() {
  const [comboMealData, setComboMeal] = useState({
    image: null,
    name: '',
    price: '',
  });

  const [combo, setCombo] = useState([]);

  const [isImageSelected, setIsImageSelected] = useState(false);

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  const handleInputChange = (e) => {
    setComboMeal({
      ...comboMealData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    try {
      const selectedImage = e.target.files[0];

      if (!selectedImage) {
        setIsImageSelected(false);
        return;
      }

      setComboMeal((prevComboData) => ({
        ...prevComboData,
        image: selectedImage,
      }));

      setIsImageSelected(true);
    } catch (error) {
      console.error('Error handling image change:', error);
    }
  };

  console.log('Combo Meal Data', comboMealData);

  const handleAddCombo = async () => {
    try {
      if (!isImageSelected) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Vui lòng chọn hình ảnh',
          icon: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', comboMealData.name);
      formData.append('price', comboMealData.price);
      formData.append('image', comboMealData.image);

      const resposeCombo = await axios.post(`${apiUrl}/combo/addCombo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (resposeCombo.status === 201) {
        Swal.fire({
          title: 'Thành công',
          text: `Phim "${comboMealData.name}" đã được thêm thành công!`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi thêm combo meal',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding coombo meal:', error);

      Swal.fire({
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi thêm combo meal',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const respose = await axios.get(`${apiUrl}/combo/getCombo`);
        setCombo(respose.data);
      } catch (error) {
        console.error('Error fetching combo data:', error);
      }
    };
    fetchCombo();
  }, []);

  function decodeBase64Image(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  function convertPriceToVND(price) {
    const priceString = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return priceString + ' VND';
  }

  return (
    <div className={cx('admin-comboMeal')}>
      <div className={cx('button-controllers')}>
        <a>Admin </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a href="/admin/home">Home </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a>Thêm Combo Đồ ăn </a>
      </div>

      <div className={cx('comboMeal-container')}>
        <div className={cx('images-input')}>
          <label className={cx('box-images')} htmlFor="fileInput">
            {isImageSelected ? 'Đã chọn ảnh' : 'Chọn ảnh'}
            <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          </label>
        </div>

        <div className={cx('wrapper-input')}>
          <div className={cx('detail')}>
            <div className={cx('box-input')}>
              <span>Tên (Combo) đồ ăn</span>
              <input
                type="text"
                name="name"
                value={comboMealData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên Combo..."
              />
            </div>

            <div className={cx('box-input')}>
              <span>Giá tiền</span>
              <input
                type="text"
                name="price"
                value={comboMealData.price}
                onChange={handleInputChange}
                placeholder="Nhập giá phim..."
              />
            </div>
          </div>

          <button className={cx('btn-comboMeal')} onClick={handleAddCombo}>
            Thêm
          </button>
        </div>
      </div>

      <div className={cx('listCombo')}>
        <h3>Danh sách Combo đang có</h3>
        {combo.map((item, index) => (
          <div className={cx('box')} key={index}>
            <div className={cx('image')}>
              <img className={cx('image')} src={decodeBase64Image(item.image)} alt={item.name} />
            </div>
            <span className={cx('name')}>x1 {item.name}</span>
            <span className={cx('price')}>{convertPriceToVND(item.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComboMeal;
