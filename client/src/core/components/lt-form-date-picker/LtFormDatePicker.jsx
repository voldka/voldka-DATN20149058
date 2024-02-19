import { DatePicker, Form } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormDatePicker = ({ label, error, name, control, rules, placeholder }) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <DatePicker
              {...field}
              placeholder={placeholder}
              format='DD/MM/YYYY'
              className='w-100'
              size='large'
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default LtFormDatePicker;
