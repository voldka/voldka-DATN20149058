import { Form } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormTextArea = ({ label, error, name, rules, control, children, placeholder }) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          rules={rules}
          control={control}
          render={({ field }) => (
            <textarea className='form-control' rows={4} placeholder={placeholder} {...field} />
          )}
        />
      </Form.Item>
    </>
  );
};

export default LtFormTextArea;
