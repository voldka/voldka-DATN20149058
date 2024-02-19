import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Modal, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import LtFormInput from '../../core/components/lt-form-input';
import LtFormTextArea from '../../core/components/lt-form-textarea';
import ProductTypesService from '../../shared/services/product-types.service';
import { productService } from '../../shared/services/products.service';
import { actions } from '../../stores';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UpdateProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: null,
      price: '',
      countInStock: '',
      description: '',
    },
  });
  const dispatch = useDispatch();

  const setFormValue = (product) => {
    const formValues = {};
    for (let field in product) {
      switch (field) {
        case 'name': {
          formValues.name = product.name;
          break;
        }
        case 'type': {
          formValues.type = product.type._id;
          break;
        }
        case 'countInStock': {
          formValues.countInStock = product.countInStock;
          break;
        }
        case 'price': {
          formValues.price = product.price;
          break;
        }
        case 'description': {
          formValues.description = product.description;
          break;
        }
        case 'image': {
          setImages(product.image);
          break;
        }
        default: {
          break;
        }
      }
    }
    reset(formValues);
  };

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

  const getProductDetail = async () => {
    try {
      dispatch(actions.showLoading());
      const product = await productService.getProductById(productId);
      setFormValue(product);
      setProduct(product);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewOpen(false);

  const handleChange = (info) => {
    const { fileList } = info;

    if (fileList.length > 5) {
      messageApi.warning('Chỉ upload được tối đa 5 hình ảnh');
      return;
    }

    const hasInvalidImage = fileList.some((file) => !file.type.startsWith('image/'));
    if (hasInvalidImage) {
      messageApi.warning('Chỉ cho phép upload hình ảnh');
      return;
    }
    const newFileList = fileList.reduce((results, file) => {
      const isExisted = results.some((item) => item.name === file.name);
      if (!isExisted) {
        results.push(file);
      }
      return results;
    }, []);

    setFileList(newFileList);
  };

  const handleRemoveExistedImage = (removedUrl) => {
    setImages(images.filter((itemUrl) => itemUrl !== removedUrl));
  };

  const handleUpdateProduct = async (formValues) => {
    try {
      dispatch(actions.showLoading());
      if (!images.length && !fileList) {
        return messageApi.error('Vui lòng cung cấp hình ảnh sản phẩm');
      }
      const formData = new FormData();
      for (const field in formValues) {
        formData.append(field, formValues[field]);
      }
      formData.append('images', JSON.stringify(images));
      if (fileList && fileList.length) {
        fileList.forEach((file) => {
          formData.append('newImages', file.originFileObj);
        });
      }
      await productService.updateProducts(formData, productId);
      messageApi.success('Cập nhật thành công');
      setFileList();
      getProductDetail();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  useEffect(() => {
    getProductDetail();
    getProductTypes();
  }, []);

  return (
    <>
      {product ? (
        <>
          {' '}
          {contextHolder}
          <div className='container'>
            <Form layout='vertical' onFinish={handleSubmit(handleUpdateProduct)}>
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
                dropdownOptions={productTypes.map((type) => ({
                  label: type.name,
                  value: type._id,
                }))}
                rules={{
                  required: 'Vui lòng chọn loại sản phẩm',
                }}
              />
              <div>
                <p className='m-0 mb-1'>Hình ảnh sản phẩm</p>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                  }}
                  className='my-2'>
                  {images && images.length ? (
                    <>
                      {images.map((url) => (
                        <div className='text-center'>
                          <img
                            alt='product'
                            src={url}
                            style={{ width: 100, height: 100, objectFit: 'contain' }}
                          />
                          <Button
                            type='text'
                            danger
                            className='mt-1'
                            onClick={() => handleRemoveExistedImage(url)}>
                            Xoá
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : null}
                  <Upload
                    multiple
                    maxCount={5 - (images && images.length ? images.length : 0)}
                    listType='picture-card'
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => {
                      return false;
                    }}>
                    {(images && images.length ? images.length : 0) + fileList?.length >=
                    5 ? null : (
                      <span>Tải ảnh lên</span>
                    )}
                  </Upload>
                </div>
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
              <div className='flex ai-center jc-between'>
                <NavLink to='/admin/san-pham'>
                  <Button size='large' htmlType='button' icon={<ArrowLeftOutlined />}>
                    Quay lại danh sách
                  </Button>
                </NavLink>
                <Button type='primary' size='large' htmlType='submit'>
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </div>
        </>
      ) : (
        <div className='flex ai-center jc-center flex-col'>
          <Empty description='Không tìm thấy sản phẩm' />
          <NavLink to='/admin/san-pham' className='mt-4'>
            <Button size='large' htmlType='button' icon={<ArrowLeftOutlined />}>
              Quay lại danh sách
            </Button>
          </NavLink>
        </div>
      )}
    </>
  );
};

export default UpdateProduct;
