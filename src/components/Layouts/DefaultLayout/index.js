import Header from './Header';

import MovieShowing from '~/pages/MovieShowing';
import Profile from '~/pages/Profile';

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="container">{children}</div>
    </div>
  );
}

export default DefaultLayout;
