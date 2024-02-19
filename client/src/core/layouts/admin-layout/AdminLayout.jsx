import {
  AppstoreOutlined,
  BookOutlined,
  DiffOutlined,
  FileImageOutlined,
  GiftOutlined,
  HomeOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { actions } from '../../stores';

const menuItems = [
  {
    path: '',
    label: 'Dashboard',
    activeKey: 'admin',
    icon: <HomeOutlined />,
  },
  {
    path: 'tai-khoan',
    label: 'Tài khoản',
    activeKey: 'tai-khoan',
    icon: <UserOutlined />,
  },
  {
    path: 'don-hang',
    label: 'Đơn hàng',
    activeKey: 'don-hang',
    icon: <DiffOutlined />,
  },
  {
    path: 'loai-san-pham',
    label: 'Loại sản phẩm',
    activeKey: 'loai-san-pham',
    icon: <AppstoreOutlined />,
  },
  {
    path: 'san-pham',
    label: 'Sản phẩm',
    activeKey: 'san-pham',
    icon: <BookOutlined />,
  },
  {
    path: 'banner',
    label: 'Quảng cáo',
    activeKey: 'banner',
    icon: <FileImageOutlined />,
  },
  // {
  //   path: 'khuyen-mai',
  //   label: 'Khuyến mãi',
  //   activeKey: 'khuyen-mai',
  //   icon: <GiftOutlined />,
  // },
];

const titleMap = {
  admin: 'admin dashboard',
  'don-hang': 'quản lý đơn hàng',
  'tai-khoan': 'quản lý tài khoản',
  'san-pham': 'quản lý sản phẩm',
  banner: 'quản lý quảng cáo',
  'khuyen-mai': 'quản lý khuyến mãi',
  'loai-san-pham': 'quản lý loại sản phẩm',
  'cap-nhat-san-pham': 'cập nhật sản phẩm',
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState('admin');
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(actions.resetUser());
    dispatch(actions.setCartProducts([]));
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname.split('/').length >= 4) {
      setCurrentPage('cap-nhat-san-pham');
    } else {
      const segment = location.pathname.split('/').pop();
      setCurrentPage(segment);
    }
  }, [location.pathname]);

  return (
    <>
      <div style={{ minHeight: '100vh' }}>
        <Layout hasSider className='bg-white h-100' style={{ minHeight: '100vh' }}>
          <div className='py-1'>
            <Layout.Sider
              trigger={null}
              collapsible
              collapsed={isCollapsed}
              className='bg-transparent h-100 border-right'>
              <div className='pt-3 h-100'>
                <div className='flex ai-center jc-center pb-2'>
                  <Tooltip title='Menu' placement='right' arrow={true}>
                    <Button
                      type={!isCollapsed ? 'primary' : 'default'}
                      danger={!isCollapsed}
                      onClick={() => setIsCollapsed(!isCollapsed)}>
                      {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                  </Tooltip>
                </div>
                <Menu mode='inline' className='px-2'>
                  {menuItems.map((item, idx) => (
                    <Menu.Item
                      key={`menu-item-${idx}`}
                      className={currentPage === item.activeKey ? 'ant-menu-item-selected' : ''}>
                      <NavLink to={item.path} className='flex ai-center'>
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            </Layout.Sider>
          </div>
          <Layout.Content>
            <div className='h-100'>
              <div className='py-3 px-4 border-bottom flex ai-center jc-between pr-5'>
                <Typography.Title className='text-capitalize m-0'>
                  {titleMap[currentPage]}
                </Typography.Title>
                <Tooltip title='Đăng xuất' arrow={true}>
                  <Button type='primary' danger size='large' onClick={handleLogout}>
                    <LoginOutlined /> Đăng xuất
                  </Button>
                </Tooltip>
              </div>
              <div className='p-4'>
                <Outlet />
              </div>
            </div>
          </Layout.Content>
        </Layout>
      </div>
    </>
  );
};

export default AdminLayout;
