import { ConfigProvider } from 'antd';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../footer';
import Header from '../header';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../stores';

const NonAuth = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectors.selectUserInfo);

  useEffect(() => {
    if (window.performance.navigation.type === 1 && userInfo) {
      dispatch(actions.getCartByUserId(userInfo.id));
    }
  }, []);

  return (
    <>
      <div id='client-layout'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#74ABFA',
            },
          }}>
          <Header />
          <main id='non-auth-content'>
            <Outlet />
          </main>
          <Footer />
        </ConfigProvider>
      </div>
    </>
  );
};

export default NonAuth;
