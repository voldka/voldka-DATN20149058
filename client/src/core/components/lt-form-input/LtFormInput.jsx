import { Form, Input } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormInput = ({
  label,
  error,
  name,
  rules,
  control,
  placeholder,
  isPassword,
  isReadOnly,
  isDisabled,
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          rules={rules}
          control={control}
          render={({ field }) =>
            isPassword ? (
              <Input.Password
                size='large'
                readOnly={isReadOnly}
                disabled={isDisabled}
                placeholder={placeholder}
                {...field}
              />
            ) : (
              <Input
                size='large'
                readOnly={isReadOnly}
                disabled={isDisabled}
                placeholder={placeholder}
                {...field}
              />
            )
          }
        />
      </Form.Item>
    </>
  );
};

export default LtFormInput;
