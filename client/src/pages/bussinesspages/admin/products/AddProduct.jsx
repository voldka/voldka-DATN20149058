import { Form, Modal, Upload, message } from 'antd';
import React from 'react';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import LtFormInput from '../../core/components/lt-form-input';
import LtFormTextArea from '../../core/components/lt-form-textarea';

const AddProduct = ({
  control,
  errors,
  fileList,
  handleChange,
  handlePreview,
  previewOpen,
  previewImage,
  previewTitle,
  handleCancel,
  productTypes = [],
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Form layout='vertical'>
        <LtFormInput
          name='name'
          control={control}
          error={errors.name}
          label='Tên sản phẩm'
          placeholder='Tên sản phẩm'
          rules={{
            required: 'Vui lòng nhập thông tin',
          }}
        />
        <LtFormDropdown
          name='type'
          control={control}
          error={errors.type}
          label='Loại sản phẩm'
          placeholder='Loại sản phẩm'
          dropdownOptions={productTypes}
          rules={{
            required: 'Vui lòng chọn loại sản phẩm',
          }}
        />
        <div>
          <p className='m-0 mb-1'>Hình ảnh sản phẩm</p>
          <Upload
            multiple
            maxCount={5}
            listType='picture-card'
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => {
              return false;
            }}>
            {fileList?.length >= 5 ? null : <span>Tải ảnh lên</span>}
          </Upload>
        </div>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img
            alt='example'
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
        <LtFormInput
          label='Giá'
          control={control}
          name='price'
          placeholder='Giá'
          error={errors.price}
          rules={{
            required: 'Vui lòng nhập thông tin',
            validate: (value) => {
              if (isNaN(+value) || +value < 0) {
                return 'Giá tiền không hợp lệ';
              }
              return null;
            },
          }}
        />
        <LtFormInput
          label='Số lượng'
          control={control}
          name='countInStock'
          placeholder='Số lượng'
          error={errors.countInStock}
          rules={{
            required: 'Vui lòng nhập thông tin',
            validate: (value) => {
              if (isNaN(+value) || +value < 0) {
                return 'Số lượng không hợp lệ';
              }
              return null;
            },
          }}
        />
        <LtFormTextArea
          label='Mô tả sản phẩm'
          name='description'
          control={control}
          error={errors.description}
          placeholder='Nhập mô tả sản phẩm'
          rules={{
            required: 'Vui lòng nhập thông tin',
          }}
        />
      </Form>
    </>
  );
};

export default AddProduct;
