import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Image, Space, Tooltip, Upload, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import LtFormInput from '../../core/components/lt-form-input';
import LtFormModal from '../../core/components/lt-form-modal';
import ProductTypesService from '../../shared/services/product-types.service';
import { actions } from '../../stores';

const ProductTypes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productTypeId, setProductTypeId] = useState(null);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } });

  const getProductTypes = async () => {
    try {
      dispatch(actions.showLoading());
      const productTypes = await ProductTypesService.getAll();
      setProductTypes(productTypes);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleCloseModal = () => {
    revokeImageUrl();
    reset({ name: '' });
    setIsOpen(false);
    setIsUpdating(false);
    setImageFile(null);
    setProductTypeId(null);
  };

  const revokeImageUrl = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(null);
    setImageUrl(null);
  };

  const handleUploadImageFile = ({ file }) => {
    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size / 1024 / 1024 < 10;
    if (!isImage) {
      return messageApi.warning('Chi cho phép upload hình ảnh');
    }
    if (!isSizeValid) {
      return messageApi.warning('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
    }

    revokeImageUrl();
    const imageUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl(imageUrl);
  };

  const openUpdateProductTypeDialog = async (productType) => {
    reset({
      name: productType.name,
    });
    setImageUrl(productType.imageUrl);
    setProductTypeId(productType._id);
    setIsUpdating(true);
    setIsOpen(true);
  };

  const createProductType = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      if (!imageUrl) {
        return messageApi.warning('Vui lòng cung cấp hình ảnh loại sản phẩm');
      }
      const formData = new FormData();
      formData.append('name', formValue.name);
      formData.append('image', imageFile);
      formData.append('imageUrl', imageUrl);
      const newProductType = await ProductTypesService.create(formData);
      setProductTypes([newProductType, ...productTypes]);
      handleCloseModal();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const updateProductType = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      const formData = new FormData();
      formData.append('name', formValue.name);
      if (imageFile) {
        formData.append('image', imageFile);
        formData.append('imageUrl', imageUrl);
      }
      await ProductTypesService.update(productTypeId, formData);
      handleCloseModal();
      getProductTypes();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleSubmitProductTypeForm = (formValue) => {
    if (isUpdating) {
      updateProductType(formValue);
    } else {
      createProductType(formValue);
    }
  };

  const handleDeleteProductType = async (productTypeId) => {
    Swal.fire({
      icon: 'question',
      title: 'Xoá Loại Sản Phẩm',
      text: 'Bạn có chắc là muốn xoá loại sản phẩm này không?',
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: 'red',
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        try {
          dispatch(actions.showLoading());
          await ProductTypesService.delete(productTypeId);
          messageApi.success('Xoá loại sản phẩm thành công');
          getProductTypes();
        } catch (error) {
          messageApi.error(error?.response?.data?.message || error.message);
        } finally {
          dispatch(actions.hideLoading());
        }
      }
    });
  };

  const columns = useMemo(() => {
    return [
      {
        key: '1',
        title: '#',
        dataIndex: '_id',
        render: (value) => value.slice(-7, -1),
        align: 'center',
      },
      {
        key: '2',
        title: 'Loại sản phẩm',
        dataIndex: 'imageUrl',
        render: (value) => (
          <Image src={value} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        ),
        align: 'center',
      },
      {
        key: '3',
        title: 'Tên',
        dataIndex: 'name',
        render: (value) => <span className='text-capitalize'>{value}</span>,
      },
      {
        key: '4',
        title: null,
        dataIndex: null,
        render: (_, productType) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button
                size='large'
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => openUpdateProductTypeDialog(productType)}
              />
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                danger
                size='large'
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteProductType(productType._id)}
              />
            </Tooltip>
          </Space>
        ),
        align: 'center',
      },
    ];
  }, []);

  useEffect(() => {
    getProductTypes();
  }, []);

  return (
    <>
      <div className='py-2'>
        {contextHolder}
        <Button size='large' type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
          Thêm mới
        </Button>
      </div>
      <LtDynamicTable cols={columns} dataSrc={productTypes} rowKey='_id' />
      <LtFormModal
        isOpen={isOpen}
        title={isUpdating ? 'CẬP NHẬT LOẠI SẢN PHẨM' : 'THÊM LOẠI SẢN PHẨM'}
        onCancel={handleCloseModal}
        okBtnText={isUpdating ? 'Cập nhật' : 'Thêm'}
        cancelBtnText='Huỷ'
        onSubmit={handleSubmit(handleSubmitProductTypeForm)}>
        <Form name='my-add-product-type-form' layout='vertical'>
          <LtFormInput
            label='Tên sản phẩm'
            name='name'
            control={control}
            error={errors.name}
            placeholder='Nhập loại sản phẩm'
            rules={{ required: 'Tên không được để trống' }}
          />
          {imageUrl && (
            <div className='text-center py-2'>
              <Image src={imageUrl} style={{ width: 120, height: 120, objectFit: 'contain' }} />
            </div>
          )}
          <div className='pt-3 text-center'>
            <Upload
              name='avatar'
              onRemove={revokeImageUrl}
              beforeUpload={() => false}
              onChange={handleUploadImageFile}
              showUploadList={false}>
              <Button size='large' icon={<UploadOutlined />}>
                Tải ảnh lên
              </Button>
            </Upload>
          </div>
        </Form>
      </LtFormModal>
    </>
  );
};

export default ProductTypes;
