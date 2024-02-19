import { Form, Select } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

const LtFormDropdown = ({
  label,
  error,
  name,
  control,
  rules,
  placeholder,
  dropdownOptions,
  hasSearch,
  isMultiple,
}) => {
  return (
    <>
      <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error && error.message}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              mode={isMultiple && 'multiple'}
              placeholder={placeholder}
              options={dropdownOptions}
              showSearch={hasSearch}
              size='large'
              {...field}
            />
          )}
        />
      </Form.Item>
    </>
  );
};

export default LtFormDropdown;
