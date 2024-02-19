import React from 'react';
import './style.scss';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../shared/services/auth-service';
import { useDispatch } from 'react-redux';
import { actions } from '../../stores';
import { useForm } from 'react-hook-form';
import LtFormInput from '../../core/components/lt-form-input';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      phone: '',
      address: '',
    },
  });

  const handleRegister = async (values) => {
    try {
      dispatch(actions.showLoading());
      delete values.passwordConfirm;
      const user = await authService.signUp(values);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(actions.setUser(user));
      messageApi.open({
        type: 'success',
        content: 'Đăng ký thành công',
      });
      return navigate('/');
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error?.response?.data?.message || error.message,
      });
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  return (
    <div className='register py-3 layout-height'>
      {contextHolder}
      <div className='register-container'>
        <div className='register-title'>
          <h2
            className='title'
            style={{ borderTopLeftRadius: '10px' }}
            onClick={() => navigate('/dang-nhap')}>
            Đăng Nhập
          </h2>
          <h2 className='title active' style={{ borderTopRightRadius: '10px' }}>
            Đăng Ký
          </h2>
        </div>
        <div className='register-form'>
          <Form layout='vertical' onFinish={handleSubmit(handleRegister)}>
            <LtFormInput
              name='email'
              label='Email'
              control={control}
              error={errors.email}
              placeholder='Nhập email'
              rules={{
                required: 'Không được để trống',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Email không hợp lệ',
                },
              }}
            />
            <div className='row'>
              <div className='col-md-6 col-xs-12'>
                <LtFormInput
                  isPassword
                  name='password'
                  label='Mật khẩu'
                  control={control}
                  error={errors.password}
                  placeholder='Nhập mật khẩu'
                  rules={{
                    required: 'Không được để trống',  
                    pattern: {
                      value:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}$/,
                      message:
                        'Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt, tối thiểu là 8 ký tự.',
                    },
                  }}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <LtFormInput
                  control={control}
                  isPassword
                  name='passwordConfirm'
                  label='Xác nhận mật khẩu'
                  error={errors.passwordConfirm}
                  placeholder='Nhập lại mật khẩu'
                  rules={{
                    required: 'Không được để trống',
                    validate: (value) =>
                      value === watch('password') || 'Mật khẩu xác nhận không khớp',
                  }}
                />
              </div>
            </div>

            <LtFormInput
              name='name'
              label='Họ và tên'
              control={control}
              error={errors.name}
              placeholder='Nhập họ và tên'
              rules={{ required: 'Không được để trống' }}
            />
            <LtFormInput
              name='phone'
              label='Số điện thoại'
              control={control}
              error={errors.phone}
              placeholder='Nhập số điện thoại'
              rules={{
                required: 'Không được để trống',
                pattern: {
                  value: /^(\+84|0)(3|5|7|8|9)(\d{8})$/,
                  message: 'Định dạng số điện thoại không hợp lệ.',
                },
              }}
            />
            <LtFormInput
              name='address'
              label='Địa chỉ'
              control={control}
              placeholder='Nhập địa chỉ của bạn'
            />
            <div className='form-group'>
              <Button size='large' type='primary' className='w-100' htmlType='submit'>
                Đăng Ký
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
