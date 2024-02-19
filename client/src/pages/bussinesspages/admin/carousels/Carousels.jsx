import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Space, Tooltip, Upload, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import LtFormModal from '../../core/components/lt-form-modal';
import CarouselsService from '../../shared/services/carousels.service';
import { actions } from '../../stores';

const Carousels = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [carousels, setCarousels] = useState([]);
  const [carouselId, setCarouselId] = useState(null);

  const getCarousels = async () => {
    try {
      dispatch(actions.showLoading());
      const data = await CarouselsService.getAll();
      setCarousels(data);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const openUpdateProductTypeDialog = async (carousel) => {
    setImageUrl(carousel.imageUrl);
    setCarouselId(carousel._id);
    setIsUpdating(true);
    setIsOpen(true);
  };

  const revokeImageUrl = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(null);
    setImageUrl(null);
  };

  const handleCloseModal = () => {
    revokeImageUrl();
    setIsOpen(false);
    setIsUpdating(false);
    setImageFile(null);
    setCarouselId(null);
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

  const createCarousel = async () => {
    try {
      dispatch(actions.showLoading());
      if (!imageFile || !imageUrl) {
        return messageApi.warning('Vui lòng tải ảnh banner bạn muốn sử dụng');
      }
      const formData = new FormData();
      formData.append('imageUrl', imageUrl);
      formData.append('image', imageFile);
      formData.append('order', carousels.length + 1);
      await CarouselsService.create(formData);
      handleCloseModal();
      getCarousels();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const updateCarousel = async () => {
    try {
      dispatch(actions.showLoading());
      if (!imageFile || !imageUrl) {
        return messageApi.warning('Vui lòng tải ảnh banner bạn muốn sử dụng');
      }
      const formData = new FormData();
      formData.append('imageUrl', imageUrl);
      formData.append('image', imageFile);
      await CarouselsService.update(carouselId, formData);
      handleCloseModal();
      getCarousels();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleSubmitCarouselForm = () => {
    if (isUpdating) {
      updateCarousel();
    } else {
      createCarousel();
    }
  };

  const handleDeleteCarousel = async (carouselId) => {
    Swal.fire({
      icon: 'question',
      title: 'Xoá Banner',
      text: 'Bạn có chắc là muốn xoá banner này không?',
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: 'red',
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        try {
          dispatch(actions.showLoading());
          messageApi.success('Xoá banner thành công');
          await CarouselsService.delete(carouselId);
          getCarousels();
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
        title: 'Banner',
        dataIndex: 'imageUrl',
        render: (value) => (
          <Image src={value} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        ),
        align: 'center',
      },
      {
        key: '2',
        title: 'Thứ tự hiển thị',
        dataIndex: 'order',
        align: 'center',
      },
      {
        key: '3',
        title: null,
        dataIndex: null,
        render: (_, carousel) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button
                size='large'
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => openUpdateProductTypeDialog(carousel)}
              />
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                danger
                size='large'
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCarousel(carousel._id)}
              />
            </Tooltip>
          </Space>
        ),
        align: 'center',
      },
    ];
  }, []);

  useEffect(() => {
    getCarousels();
  }, []);

  return (
    <>
      <div className='py-2'>
        {contextHolder}
        <Button size='large' type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
          Thêm mới
        </Button>
      </div>
      <LtDynamicTable cols={columns} dataSrc={carousels} rowKey='_id' />
      <LtFormModal
        width='70vw'
        isOpen={isOpen}
        cancelBtnText='Huỷ'
        title={isUpdating ? 'CẬP NHẬT BANNER' : 'THÊM BANNER'}
        okBtnText={isUpdating ? 'Cập nhật' : 'Thêm'}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitCarouselForm}>
        {imageUrl && (
          <div className='text-center py-2'>
            <Image src={imageUrl} style={{ width: '100%', height: 480, objectFit: 'contain' }} />
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
      </LtFormModal>
    </>
  );
};

export default Carousels;
