import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './Home.scss';

const cx = classNames.bind(styles);

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [films, setFilms] = useState([]);
  const [genres, setGenres] = useState([]);
  const apiUrl = process.env.REACT_APP_LOCAL_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/film/getfilm`)
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error('Error fetching films:', error));
    
    fetch(`${apiUrl}/genre/getgenres`)
      .then((response) => response.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  // Lọc danh sách phim
  const filteredFilms = films.filter((film) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return searchRegex.test(film.name) || searchRegex.test(film.category);
  });

  return (
    <div>
      <div className={cx('admin-home')}>
        <div className={cx('button-controllers')}>
          <a href="/admin/add-film">Thêm phim</a>
          <a href="/admin/add-genre">Thêm thể loại phim</a>
          <a href="/admin/add-comboMeal">Thêm đồ ăn</a>
        </div>

        <div className={cx('list-film')}>
          <div className={cx('navigation')}>
            <h3>Danh sách phim</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên phim cần tìm...."
            />
          </div>

          <div className={cx('listContainer-film')}>
            {filteredFilms.map((film, index) => {
              const imageSrc = `data:image/png;base64,${film.image}`;
              const genreName = genres.find(genre => genre.genreId === film.genreId)?.name;
              return (
                <div key={index} className={cx('box')}>
                  <div className={cx('image-film')}>
                    <img src={imageSrc} alt={film.name} />
                  </div>
                  <div className="content-film">
                    <span className={cx('name-film')}>{film.name}</span>
                    <span className={cx('duration')}>{`Thời gian: ${film.duration}p`}</span>
                    <span className={cx('genre')}>{`Thể loại phim: ${genreName}`}</span>
                    <span className={cx('releaseDate')}>{`Ngày phát hành: ${film.releaseDate}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cx('list-staff')}>
          <h3> Danh sách nhân viên</h3>
          <div className={cx('listContainer-staff')}></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
