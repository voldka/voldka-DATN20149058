import { Checkbox, Form } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormCheckbox = ({ children, name, control, rules, text, error, ...others }) => {
  return (
    <>
      <Form.Item validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rule={rules}
          render={({ field }) => (
            <Checkbox {...field} checked={field.value} {...others}>
              {text}
            </Checkbox>
          )}
        />
      </Form.Item>
    </>
  );
};

export default LtFormCheckbox;
