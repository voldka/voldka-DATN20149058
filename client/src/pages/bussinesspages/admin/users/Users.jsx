import { DeleteOutlined, EditOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Tag, Tooltip, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import LtDynamicTable from '../../core/components/lt-dynamic-table/';
import LtFormModal from '../../core/components/lt-form-modal';
import UserService from '../../shared/services/users.service';
import { actions } from '../../stores';
import EditUser from './edit-user/EditUser';
import UserOrderHistory from './user-order-history';

const FORM_DEFAULT_VALUE = {
  _id: '',
  email: '',
  name: '',
  phone: '',
  address: '',
  password: '',
  isAdmin: false,
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenHistoryOrder, setIsOpenHistoryOrder] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...FORM_DEFAULT_VALUE,
    },
  });

  const setFormValueAndOpenEditForm = (user) => {
    reset({
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
    });
    setCurrentAvatar(user.avatar);
    setIsOpen(true);
  };

  const clearEditForm = () => {
    reset({ ...FORM_DEFAULT_VALUE });
    setCurrentAvatar(null);
    setIsOpen(false);
  };

  const updateUser = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      const updatedUser = await UserService.updateUser(formValue._id, {
        isAdmin: formValue.isAdmin,
        password: formValue.password || undefined,
      });
      const idx = users.findIndex((user) => user._id === updatedUser._id);
      if (idx !== -1) {
        users[idx] = updatedUser;
      }
      clearEditForm();
      messageApi.success('Cập nhật thành công');
      setUsers([...users]);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const openOrderHistory = (userId) => {
    setUserId(userId);
    setIsOpenHistoryOrder(true);
  };

  const closeOrderHistory = () => {
    setUserId(null);
    setIsOpenHistoryOrder(false);
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      icon: 'question',
      title: 'Xoá Tài Khoản',
      text: 'Bạn có chắc là muốn xoá tài khoản này không?',
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: 'red',
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        try {
          dispatch(actions.showLoading());
          await UserService.deleteUser(userId);
          messageApi.success('Xoá tài khoản thành công');
          setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
          messageApi.error(error?.response?.data?.message || error.message);
        } finally {
          dispatch(actions.hideLoading());
        }
      }
    });
  };

  const tableColumns = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: '_id',
        render: (value) => value.slice(-7),
        align: 'center',
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Họ và tên',
        dataIndex: 'name',
        render: (value) => <span className='text-capitalize'>{value}</span>,
      },
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        align: 'center',
        render: (value) => <Avatar src={value} size={48} icon={<UserOutlined />} />,
      },
      {
        title: 'Điện thoại',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: 'Loại tài khoản',
        dataIndex: 'isAdmin',
        render: (value) => (
          <Tag color={value ? '#108ee9' : '#87d068'}>{value ? 'Admin' : 'Khách hàng'}</Tag>
        ),
        align: 'center',
      },
      {
        title: '',
        dataIndex: null,
        render: (_, user) => (
          <Space>
            <Tooltip title='Cập nhật người dùng'>
              <Button
                size='large'
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => setFormValueAndOpenEditForm(user)}
              />
            </Tooltip>
            <Tooltip title='Xem lịch sử đặt hàng'>
              <Button
                size='large'
                shape='circle'
                icon={<HistoryOutlined />}
                onClick={() => openOrderHistory(user._id)}
              />
            </Tooltip>
            <Tooltip title='Xoá người dùng'>
              <Button
                danger
                size='large'
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteUser(user._id)}
              />
            </Tooltip>
          </Space>
        ),
        align: 'center',
      },
    ];
  }, [users.length]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        dispatch(actions.showLoading());
        const users = await UserService.getAllUsers();
        setUsers(users);
      } catch (error) {
        messageApi.error(error?.response?.data?.message || error.message);
      } finally {
        dispatch(actions.hideLoading());
      }
    };

    getAllUsers();
  }, []);

  return (
    <>
      {contextHolder}
      <LtDynamicTable
        hasFilters
        cols={tableColumns}
        dataSrc={users}
        rowKey='_id'
        searchByFields={['email', 'name', 'phone']}
      />
      <LtFormModal
        width='50vw'
        isOpen={isOpen}
        okBtnText='Cập nhật'
        cancelBtnText='Đóng'
        title='CẬP NHẬT NGƯỜI DÙNG'
        onCancel={clearEditForm}
        onSubmit={handleSubmit(updateUser)}>
        <EditUser avatar={currentAvatar} control={control} errors={errors} />
      </LtFormModal>
      <LtFormModal
        width='80vw'
        isOpen={isOpenHistoryOrder}
        okBtnText='OK'
        cancelBtnText='Đóng'
        title='DANH SÁCH ĐƠN HÀNG ĐÃ ĐẶT'
        onCancel={closeOrderHistory}
        onSubmit={closeOrderHistory}>
        <UserOrderHistory userId={userId} />
      </LtFormModal>
    </>
  );
};

export default Users;
