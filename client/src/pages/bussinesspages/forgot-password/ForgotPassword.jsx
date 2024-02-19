import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form, message } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LtFormInput from '../../core/components/lt-form-input';
import { actions, selectors } from '../../stores';
import './style.scss';
import { authService } from '../../shared/services/auth-service';

export default function ForgotPassword() {
  const [isResend, setIsResend] = useState(false);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.selectIsLoading);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const handleResetPassword = async (values) => {
    try {
      setIsResend(false);
      dispatch(actions.showLoading());
      await authService.forgotPass(values);
      setIsResend(true);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  return (
    <div className='forgot-password layout-height'>
      {contextHolder}
      <div className='forgot-password-container'>
        <div className='forgot-password-title'>
          <h2 className='title active'>Quên Mật Khẩu</h2>
        </div>
        <div className='forgot-password-form'>
          <Form layout='vertical' onFinish={handleSubmit(handleResetPassword)}>
            <LtFormInput
              label='Email'
              name='email'
              control={control}
              error={errors.email}
              placeholder='Nhập địa chỉ email'
              rules={{
                required: 'Không được để trống',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Email không hợp lệ',
                },
              }}
            />
            {isResend && (
              <div className='pb-3'>
                <Alert
                  type='success'
                  message='Chúng tôi đã gửi một email tới hộp thư của bạn, vui lòng kiểm tra nó'
                />
              </div>
            )}
            {!isLoading && (
              <Button size='large' type='primary' className='w-100' htmlType='submit'>
                {isResend ? 'Gửi lại' : 'Gửi'}
              </Button>
            )}
          </Form>
          <hr />
          <div className='pb-3'>
            <NavLink to='/dang-nhap'>
              <Button size='large' icon={<ArrowLeftOutlined />}>
                Quay lại đăng nhập
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
