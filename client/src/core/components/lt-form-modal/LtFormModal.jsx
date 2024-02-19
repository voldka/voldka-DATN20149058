import { Button, Modal } from 'antd';
import React from 'react';

const LtFormModal = ({
  title,
  width,
  isOpen,
  children,
  okBtnText,
  cancelBtnText,
  isUseDefaultFooter = true,
  onCancel = () => {},
  onSubmit = () => {},
  ...others
}) => {
  return (
    <>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        width={width || 520}
        title={title || 'Modal title'}
        {...others}>
        <hr />
        {children}
        {isUseDefaultFooter && (
          <>
            <hr />
            <div className='d-flex justify-content-between align-items-center'>
              <Button htmlType='button' onClick={onCancel} size='large'>
                {cancelBtnText || 'Cancel'}
              </Button>
              <Button type='primary' htmlType='submit' onClick={onSubmit} size='large'>
                {okBtnText || 'Ok'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default LtFormModal;
