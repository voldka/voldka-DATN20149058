import { DeleteOutlined, DollarCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Empty, Image, Space, Tooltip, message } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import { actions, selectors } from '../../stores';
import './styles.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectors.selectProducts);
  const userInfo = useSelector(selectors.selectUserInfo);
  const [messageApi, contextHolder] = message.useMessage();

  const updateProductAmount = async (product) => {
    try {
      const { value: newAmount, isConfirmed } = await Swal.fire({
        title: 'Nhập Số Lượng Muốn Thay Đổi',
        input: 'number',
        inputLabel: 'Số lượng',
        inputValue: product.amount || 0,
        inputPlaceholder: 'Nhập số lượng muốn đổi',
        inputValidator: (value) => {
          if (!Number.isInteger(+value) || +value <= 0) {
            return 'Số lượng không hợp lệ';
          }
        },
        showCancelButton: true,
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Cập nhật',
      });
      if (+newAmount === product.amount || !isConfirmed) {
        return;
      }
      const payload = [
        {
          amount: newAmount - product.amount,
          size: product.size,
          image: product.image,
          productId: product.productId,
        },
      ];
      dispatch(actions.addProductToCart(userInfo.id, payload));
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    }
  };

  const removeProduct = (product) => {
    const payload = [
      {
        amount: 0,
        image: product.image,
        productId: product.productId,
      },
    ];
    dispatch(actions.addProductToCart(userInfo.id, payload));
  };

  useEffect(() => {
    dispatch(actions.getCartByUserId(userInfo.id));
  }, []);

  const tableColumns = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'productId',
        key: '_id',
        render: (value) => value.slice(-8, -1),
        align: 'center',
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'Hình ảnh',
        dataIndex: 'image',
        key: 'image',
        render: (value) => (
          <Image src={value} style={{ width: 120, height: 120, objectFit: 'contain' }} />
        ),
        align: 'center',
      },
      {
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (value) => <NumericFormat value={value} displayType='text' thousandSeparator=',' />,
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
        render: (value) => <NumericFormat value={value} displayType='text' thousandSeparator=',' />,
      },
      {
        title: '',
        dataIndex: null,
        key: 'actions',
        render: (_, product) => (
          <Space>
            <Tooltip title='Sửa số lượng'>
              <Button
                type='primary'
                size='large'
                icon={<EditOutlined />}
                onClick={() => updateProductAmount(product)}></Button>
            </Tooltip>
            <Tooltip title='Xoá sản phẩm'>
              <Button
                type='primary'
                danger
                size='large'
                icon={<DeleteOutlined />}
                onClick={() => removeProduct(product)}></Button>
            </Tooltip>
          </Space>
        ),
        align: 'center',
      },
    ];
  }, [products.length]);

  const totalPrice = useMemo(() => {
    return products.reduce((total, product) => total + product.totalPrice, 0);
  }, [products]);

  return (
    <>
      <div className='container-fluid px-5 py-2' id='cart'>
        {contextHolder}
        <div className='py-2'>
          <h1 className='text-center text-uppercase'>giỏ hàng</h1>
          <div className='flex ai-center jc-center py-2'>
            <img src='/images/divider.png' alt='Divider' />
          </div>
        </div>
        <div className='py-3'>
          <div className='d-flex align-items-center justify-content-between'>
            <h2 className='text-uppercase m-0'>
              <span className='mr-2'>tạm tính:</span>
              <NumericFormat
                value={totalPrice}
                displayType='text'
                thousandSeparator=','
                className='text-primary'
              />
            </h2>
            <NavLink to='/thanh-toan-don-hang'>
              <Button
                size='large'
                type='primary'
                icon={<DollarCircleOutlined />}
                disabled={!totalPrice}>
                Thanh toán đơn hàng
              </Button>
            </NavLink>
          </div>
          <hr />
          <div className='py-1'>
            {products && products.length ? (
              <>
                <LtDynamicTable
                  hasBorder
                  rowKey='_id'
                  cols={tableColumns}
                  dataSrc={products}
                  pageSize={Number.MAX_SAFE_INTEGER}
                />
              </>
            ) : (
              <div className='pb-5'>
                <Empty description='Không có sản phẩm nào trong giỏ hàng' />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
