import { Form, Radio } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormRadioGroup = ({
  name,
  label,
  error,
  rules,
  control,
  children,
  radioOptions = [],
  ...others
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Radio.Group size='large' {...field} {...others}>
              {radioOptions.map((opt, idx) => (
                <Radio key={`${name}-option-${idx}`} value={opt.value}>
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
          )}
        />
      </Form.Item>
    </>
  );
};

export default LtFormRadioGroup;
