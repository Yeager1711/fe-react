// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import DefaultLayout from '~/components/Layouts/DefaultLayout';
import DefaultLayoutAdmin from '~/components/Layouts/DefaultLayoutAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Sử dụng DefaultLayout cho publicRoutes */}
          {publicRoutes.map((route, index) => {
            const Layout = route.Layout || DefaultLayout;
            const Page = route.component;
            return (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Sử dụng DefaultLayoutAdmin cho privateRoutes */}
          {privateRoutes.map((route, index) => {
            const Layout = route.Layout || DefaultLayoutAdmin;
            const Page = route.component;
            return (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
