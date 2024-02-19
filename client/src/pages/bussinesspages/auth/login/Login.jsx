import { QuestionOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import LtFormCheckbox from '../../core/components/lt-form-checkbox';
import LtFormInput from '../../core/components/lt-form-input';
import { authService } from '../../shared/services/auth-service';
import { actions } from '../../stores';
import './style.scss';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      isRememberPwd: false,
    },
  });

  const handleLogin = async (values) => {
    try {
      dispatch(actions.showLoading());
      const { isRememberPwd, ...payload } = values;
      const user = await authService.signIn(payload);
      if (isRememberPwd) {
        localStorage.setItem('savedUser', JSON.stringify(payload));
      } else {
        localStorage.removeItem('savedUser');
      }
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(actions.setUser(user));
      dispatch(actions.getCartByUserId(user.id));
      messageApi.open({
        type: 'success',
        content: 'Đăng nhập thành công',
      });
      if (user.isAdmin) {
        return navigate('/admin');
      }
      const backToUrl = localStorage.getItem('backToUrl');
      if (backToUrl) {
        localStorage.removeItem('backToUrl');
        return navigate(backToUrl);
      }
      return navigate('/');
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.response?.data?.message || error.message,
      });
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('savedUser'));
    console.log(savedUser);
    if (savedUser) {
      reset({
        isRememberPwd: true,
        email: savedUser.email,
        password: savedUser.password,
      });
    }
  }, []);

  return (
    <div className='login layout-height'>
      {contextHolder}
      <div className='login-container'>
        <div className='login-title'>
          <h2 className='title active' style={{ borderTopLeftRadius: '10px' }}>
            Đăng Nhập
          </h2>
          <h2
            className='title'
            style={{ borderTopRightRadius: '10px' }}
            onClick={() => navigate('/dang-ky')}>
            Đăng Ký
          </h2>
        </div>
        <div className='login-form'>
          <Form layout='vertical' autoComplete='false' onFinish={handleSubmit(handleLogin)}>
            <LtFormInput
              name='email'
              label='Email'
              control={control}
              error={errors.email}
              placeholder='Nhập địa chỉ email'
              rules={{ required: 'Không được để trống' }}
            />
            <LtFormInput
              isPassword
              name='password'
              label='Mật khẩu'
              control={control}
              error={errors.password}
              placeholder='Nhập mật khẩu'
              rules={{ required: 'Không được để trống' }}
            />
            <div className='form-group'>
              <div className='d-flex align-items-center justify-content-between'>
                <LtFormCheckbox name='isRememberPwd' control={control} text='Nhớ mật khẩu' />
                <NavLink to='/quen-mat-khau'>
                  <Button htmlType='button' icon={<QuestionOutlined />}>
                    Quên mật khẩu
                  </Button>
                </NavLink>
              </div>
            </div>
            <div className='form-group'>
              <Button htmlType='submit' size='large' type='primary' className='w-100'>
                Đăng Nhập
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
