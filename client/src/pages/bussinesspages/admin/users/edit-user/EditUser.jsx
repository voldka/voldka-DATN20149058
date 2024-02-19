import { UserOutlined } from '@ant-design/icons';
import { Avatar, Form } from 'antd';
import React from 'react';
import LtFormInput from './../../../core/components/lt-form-input';
import LtFormDropdown from './../../../core/components/lt-form-dropdown';

const dropdownOptions = [
  {
    label: 'Admin',
    value: true,
  },
  {
    label: 'Khách hàng',
    value: false,
  },
];

const EditUser = ({ avatar, control, errors }) => {
  return (
    <>
      <Form layout='vertical'>
        <div className='text-center'>
          <Avatar size={84} src={avatar} icon={<UserOutlined />} />
        </div>
        <LtFormInput isDisabled label='Email' name='email' control={control} />
        <LtFormInput isDisabled label='Họ và tên' name='name' control={control} />
        <LtFormInput isDisabled label='Số điện thoại' name='phone' control={control} />
        <LtFormInput isDisabled label='Địa chỉ' name='address' control={control} />
        <LtFormInput
          isPassword
          label='Mật khẩu mới'
          name='password'
          control={control}
          error={errors.password}
          rules={{
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]{8,}$/,
              message:
                'Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt, tối thiểu là 8 ký tự.',
            },
          }}
        />
        <LtFormDropdown
          label='Vai trò'
          name='isAdmin'
          control={control}
          dropdownOptions={dropdownOptions}
        />
      </Form>
    </>
  );
};

export default EditUser;
