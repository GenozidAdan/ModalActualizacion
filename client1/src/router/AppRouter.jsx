import React, { useContext } from 'react';
import SignInPage from '../modules/auth/SignInPage';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import AuthContext from '../config/context/auth-context';
import AdminLayout from '../modules/admin/AdminLayout';
import UserPage from '../modules/admin/users/UserPage';

const AppRouter = () => {
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");
  const { user, } = useContext(AuthContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {
          user.signed ? ( 
            <>
              <Route path='/' element={<AdminLayout username={username} userRole={userRole} />}>

                <Route path='admin' element={<>ADMIN HOME
                  <br />
                  Bienvenid@ {username}
                  <br />
                  eres un {userRole}</>} />
                <Route path='/' element={<UserPage />} />
                <Route path='user' element={<>
                  <UserPage />
                  <br />
                  Bienvenid@ {username}
                  <br />
                  eres un {userRole}
                </>} />
                <Route path='client' element={<>CLIENT HOME
                  <br />
                  Bienvenid@ {username}
                  <br />
                  eres un {userRole}
                </>} />
              </Route>
            </>

          ) : (
            <Route path='/' element={<SignInPage />} />
          )}
        <Route path='/*' element={<>404 NOT FOUND</>} />
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default AppRouter