import { Button, Form } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import LtFormTextArea from '../../core/components/lt-form-textarea';

const AddComment = ({ onAddComment }) => {
  const { reset, watch, control, handleSubmit } = useForm({ defaultValues: { content: '' } });

  const handleAddComment = (formValue) => {
    reset();
    onAddComment(formValue);
  };

  return (
    <>
      <Form layout='vertical' onFinish={handleSubmit(handleAddComment)}>
        <LtFormTextArea
          name='content'
          control={control}
          placeholder='Nhận xét sản phẩm'
          label='Nhận xét sản phẩm'
        />
        <Button type='primary' size='large' disabled={!watch('content').trim()} htmlType='submit'>
          Nhận xét
        </Button>
      </Form>
    </>
  );
};

export default AddComment;
