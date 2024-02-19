import { SearchOutlined } from '@ant-design/icons';
import { Button, Carousel, Empty, Form, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import LtFormInput from '../../core/components/lt-form-input';
import ProductCard from '../../core/components/product-card';
import CarouselsService from '../../shared/services/carousels.service';
import ProductTypesService from '../../shared/services/product-types.service';
import { productService } from '../../shared/services/products.service';
import { actions } from '../../stores';
import './style.scss';

const contentStyle = {
  display: 'block',
  height: '600px',
  width: '100%',
  objectFit: 'cover',
};

const Store = () => {
  const [products, setProducts] = useState([]);
  const [productTypesOptions, setProductTypesOptions] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useSearchParams();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      productTypes: [],
    },
  });

  const getAllProducts = async (filterOptions) => {
    try {
      dispatch(actions.showLoading());
      const products = await productService.getAllProducts(filterOptions);
      setProducts(products.productData);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleSearchProduct = (formValues) => {
    for (const key of Object.keys(formValues)) {
      if (formValues[key] && formValues[key].toString().trim()) {
        searchParams.set(key, formValues[key].toString().trim());
      } else {
        searchParams.delete(key);
      }
    }
    setSearchParams(searchParams);
  };

  const handleClearSearch = () => {
    reset({ name: '', productTypes: [] });
    for (const key of searchParams.keys()) {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const initHomePage = async () => {
      try {
        dispatch(actions.showLoading());
        const [productTypes, carousels] = await Promise.all([
          ProductTypesService.getAll(),
          CarouselsService.getAll(),
        ]);
        setProductTypesOptions(productTypes);
        setCarousels(carousels);
      } catch (error) {
        messageApi.error(error?.response?.data?.message || error.message);
      } finally {
        dispatch(actions.hideLoading());
      }
    };

    initHomePage();
  }, []);

  useEffect(() => {
    const name = searchParams.get('name');
    const productTypes = searchParams.get('productTypes');
    reset({ name: name || '', productTypes: productTypes ? productTypes.split(',') : [] });
    getAllProducts({ name, productTypes });
  }, [searchParams]);

  return (
    <div className='store'>
      {contextHolder}
      <div className='py-3'>
        <Carousel autoplay className='bg-light'>
          {carousels.map((item) => (
            <div key={item._id}>
              <img style={contentStyle} src={item.imageUrl} alt='Carousel' />
            </div>
          ))}
        </Carousel>
      </div>
      <h1 className='text-center text-uppercase' id='search'>
        tìm kiếm sản phẩm
      </h1>
      <div className='flex ai-center jc-center py-3'>
        <img src='/images/divider.png' alt='Divider' />
      </div>
      <div className='container'>
        <Form layout='vertical' onFinish={handleSubmit(handleSearchProduct)}>
          <div className='row'>
            <div className='col-md-6 cold-xs-12'>
              <LtFormInput
                label='Tên sản phẩm'
                name='name'
                control={control}
                placeholder='Tìm theo tên sản phẩm'
              />
            </div>
            <div className='col-md-6 cold-xs-12'>
              <LtFormDropdown
                isMultiple
                label='Loại sản phẩm'
                name='productTypes'
                control={control}
                placeholder='Loại sản phẩm'
                dropdownOptions={productTypesOptions.map((productType) => ({
                  label: productType.name,
                  value: productType._id,
                }))}
              />
            </div>
          </div>
          <div className='text-center'>
            <Space size='middle'>
              <Button size='large' icon={<SearchOutlined />} type='primary' htmlType='submit'>
                Tìm kiếm
              </Button>
              <Button size='large' htmlType='button' onClick={handleClearSearch}>
                Bỏ lọc
              </Button>
            </Space>
          </div>
        </Form>
      </div>
      <hr />
      {products && products.length ? (
        <div className='store-body'>
          {products.map((item) => (
            <ProductCard key={item._id} product={item}/>
          ))}
        </div>
      ) : (
        <div className='text-center'>
          <Empty description='Không tìm thấy sản phẩm nào' />
        </div>
      )}
    </div>
  );
};

export default Store;
