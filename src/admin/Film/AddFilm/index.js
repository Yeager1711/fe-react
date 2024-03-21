import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './AddFilm.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

function AddFilm() {

  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  // State cho dữ liệu phim
  const [filmData, setFilmData] = useState({
    name: '',
    genre: '',
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    trailer: '',
    image: null,
  });

  // State cho danh sách thể loại
  const [genres, setGenres] = useState([]);

  // State kiểm tra xem ảnh có được chọn hay không
  const [isImageSelected, setIsImageSelected] = useState(false);

  // Fetch danh sách thể loại khi component được render
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const responseGenre = await axios.get(`${apiUrl}/genre/getgenres`);
        setGenres(responseGenre.data.genres);
        console.log("Genre Data", responseGenre)
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Xử lý sự kiện khi có thay đổi trong input
  const handleInputChange = (e) => {
    setFilmData({
      ...filmData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý sự kiện khi có thay đổi trong input hình ảnh
  const handleImageChange = (e) => {
    try {
      const selectedImage = e.target.files[0];

      if (!selectedImage) {
        setIsImageSelected(false);
        return;
      }

      setFilmData((prevFilmData) => ({
        ...prevFilmData,
        image: selectedImage,
      }));

      setIsImageSelected(true);
    } catch (error) {
      console.error('Error handling image change:', error);
    }
  };
  
  console.log('Film Data', filmData)

  // Xử lý sự kiện khi thêm phim
  const handleAddFilm = async () => {
    try {
      console.log('Handling Add Film...');
      if (!isImageSelected) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Vui lòng chọn hình ảnh',
          icon: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', filmData.name);
      formData.append('genre', filmData.genre);
      formData.append('title', filmData.title);
      formData.append('description', filmData.description);
      formData.append('releaseDate', filmData.releaseDate);
      formData.append('duration', filmData.duration);
      formData.append('trailer', filmData.trailer);
      formData.append('image', filmData.image);

      const token = localStorage.getItem('token')
      // Gửi yêu cầu POST đến API
      const response = await axios.post(`${apiUrl}/film/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log("token response", response)

      if (response.status === 201) {
        Swal.fire({
          title: 'Thành công',
          text: `Phim "${filmData.name}" đã được thêm thành công!`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi thêm phim',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding film:', error);

      Swal.fire({
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi thêm phim',
        icon: 'error',
      });
    }
  };

  return (
    <div className={cx('admin-addFilm')}>
      <div className={cx('button-controllers')}>
        <a>Admin </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a href="/admin/home">Home </a>
        <FontAwesomeIcon icon={faChevronRight} />
        <a>AddFilm </a>
      </div>

      <div className={cx('addFilm-container')}>
        <div className={cx('images-input')}>
          <label className={cx('box-images')} htmlFor="fileInput">
            {isImageSelected ? 'Đã chọn ảnh' : 'Chọn ảnh'}
            <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
          </label>
        </div>

        <div className={cx('wrapper-input')}>
          <div className={cx('detail')}>
            <div className={cx('box-input')}>
              <span>Tên phim</span>
              <input
                type="text"
                name="name"
                value={filmData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên phim..."
              />
            </div>

            <div className={cx('box-input')}>
              <span>Thể loại</span>
              <select name="genre" value={filmData.genre} onChange={handleInputChange}>
                <option value="" disabled>
                  Chọn thể loại
                </option>
                {Array.isArray(genres) &&
                  genres.map((genre) => (
                    <option key={genre.genreId} value={genre.genreId}>
                      {genre.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className={cx('box-input')}>
              <span>Tiêu đề</span>
              <input
                type="text"
                name="title"
                value={filmData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề phim..."
              />
            </div>

            <div className={cx('box-input')}>
              <span>Mô tả</span>
              <input
                type="text"
                name="description"
                value={filmData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả phim..."
              />
            </div>

            <div className={cx('box-input')}>
              <span>Ngày phát hành: yy/mm/dd</span>
              <input
                type="text"
                name="releaseDate"
                value={filmData.releaseDate}
                onChange={handleInputChange}
                placeholder="Nhập ngày phát hành phim..."
              />
            </div>

            <div className={cx('box-input')}>
              <span>Thời lượng / phút</span>
              <input
                type="number"
                name="duration"
                value={filmData.duration}
                onChange={handleInputChange}
                placeholder="Nhập thời lượng phim..."
              />
            </div>
          </div>

          <div className={cx('trailer')}>
            <div className={cx('trailer-input')}>
              <span>Thêm đường đẫn video nhúng từ youtube</span>
              <input
                type="text"
                name="trailer"
                value={filmData.trailer}
                onChange={handleInputChange}
                placeholder="Nhập đường dẫn nhúng từ video youtube..."
              />
            </div>
          </div>

          <button className={cx('btn-addFilm')} onClick={handleAddFilm}>
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFilm;
