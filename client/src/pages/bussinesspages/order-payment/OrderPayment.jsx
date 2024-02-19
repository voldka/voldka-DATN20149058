import {
  ArrowLeftOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  FormOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Alert, Button, Form, Image, Radio, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import LtFormInput from '../../core/components/lt-form-input';
import { DeliveryStatus } from '../../shared/enums/delivery-status.enum';
import { OrderStatus } from '../../shared/enums/order-status.enum';
import { PaymentMethods } from '../../shared/enums/payment-methods.enum';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { OrdersService } from '../../shared/services/orders.service';
import { actions, selectors } from '../../stores';
import Payments from './payments/Payments';
import './styles.scss';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const paymentOptions = [
  {
    label: PaymentMethods.CashOnDelivery,
    value: PaymentMethods.CashOnDelivery,
    icon: <DollarOutlined style={{ fontSize: 24 }} />,
  },
  {
    label: PaymentMethods.Credit,
    value: PaymentMethods.Credit,
    icon: <CreditCardOutlined style={{ fontSize: 36 }} />,
  },
];

const OrderPayment = () => {
  const navigate = useNavigate();
  const [paymentIntents, setPaymentIntents] = useState(null);
  const [options, setOptions] = useState({
    appearance: {
      theme: 'stripe',
    },
    clientSecret: null,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const products = useSelector(selectors.selectProducts);
  const userInfo = useSelector(selectors.selectUserInfo);
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: '',
      phone: '',
      fullName: '',
      deliveryAddress: '',
      paymentMethod: PaymentMethods.CashOnDelivery,
    },
  });

  const handleCheckout = async (formValues) => {
    try {
      dispatch(actions.showLoading());
      const payload = {
        userId: userInfo.id,
        paymentMethod: formValues.paymentMethod,
        paymentStatus:
          formValues.paymentMethod === PaymentMethods.Credit
            ? PaymentStatus.PAID
            : PaymentStatus.NOT_YET_PAY,
        deliveryStatus: DeliveryStatus.IN_PROGRESS,
        orderStatus: OrderStatus.IN_PROGRESS,
        totalBill,
        notes: formValues.notes,
        fullName: formValues.fullName.trim() || userInfo.name.trim(),
        phone: formValues.phone || userInfo.phone,
        deliveryAddress: formValues.deliveryAddress.trim() || userInfo?.address.trim(),
        products: products.map((product) => {
          const { _id, ...rest } = product;
          return rest;
        }),
      };
      await OrdersService.createOrder(payload);
      messageApi.success('Đặt đơn hàng thành công');
      dispatch(actions.setCartProducts([]));
      setTimeout(() => {
        navigate('/don-hang-cua-toi');
      }, 500);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

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
        title: 'Hỉnh ảnh',
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
    ];
  }, []);

  const totalBill = useMemo(() => {
    return products.reduce((total, product) => total + product.totalPrice, 0);
  }, [products]);

  useEffect(() => {
    const initCheckout = async () => {
      try {
        dispatch(actions.showLoading());
        dispatch(actions.getCartByUserId(userInfo.id));
        if (totalBill >= 20000) {
          const paymentIntents = await OrdersService.createPaymentIntents(totalBill);
          setPaymentIntents(paymentIntents);
          setOptions({ ...options, clientSecret: paymentIntents.client_secret });
        }
        reset({
          fullName: userInfo?.name || '',
          phone: userInfo?.phone || null,
          deliveryAddress: userInfo?.address || null,
        });
      } catch (error) {
        messageApi.error(error?.response?.data?.message || error.message);
      } finally {
        dispatch(actions.hideLoading());
      }
    };

    initCheckout();
  }, []);

  return (
    <>
      {contextHolder}
      <div className='container-fluid p-4'>
        <h2 className='text-center'>THANH TOÁN ĐƠN HÀNG</h2>
        <div className='flex ai-center jc-center py-2'>
          <img src='/images/divider.png' alt='Divider' />
        </div>
        <div className='container py-3'>
          <Form layout='vertical' onFinish={handleSubmit(handleCheckout)}>
            <h4 className='my-2 text-info'>
              <span className='mr-2'>
                <CarOutlined />
              </span>
              ĐỊA CHỈ GIAO HÀNG
            </h4>
            <LtFormInput
              label='Người nhận'
              control={control}
              error={errors.fullName}
              name='fullName'
              placeholder='Nhập tên người nhận'
              rules={{
                required: 'Tên người nhận không được để trống',
              }}
            />
            <LtFormInput
              label='Số điện thoại'
              control={control}
              error={errors.phone}
              name='phone'
              placeholder='Nhập số điện thoại'
              rules={{
                required: 'Số điện thoại không được để trống',
                pattern: {
 
                  value: /^(\+84|0)(3|5|7|8|9)(\d{8})$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              }}
            />
            <LtFormInput
              label='Địa chỉ giao hàng'
              control={control}
              error={errors.deliveryAddress}
              name='deliveryAddress'
              placeholder='Địa chỉ giao hàng'
              rules={{
                required: 'Vui lòng nhập địa chỉ giao hàng',
              }}
            />
            <hr />
            <h4 className='my-2 text-info'>
              <span className='mr-2'>
                <DollarOutlined />
              </span>
              PHƯƠNG THỨC THANH TOÁN
            </h4>
            <Form.Item>
              <Controller
                name='paymentMethod'
                control={control}
                rules={{
                  required: 'Vui lòng chọn phương thức thanh toán',
                }}
                render={({ field }) => (
                  <Radio.Group {...field}>
                    {paymentOptions.map((option) => (
                      <div key={option.value} className='p-3'>
                        <Radio value={option.value} className='checkout-option'>
                          <span className='mx-2'>{option.icon}</span>
                          <span className='text-capitalize'>{option.label}</span>
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>
                )}
              />
            </Form.Item>
            {watch('paymentMethod') === PaymentMethods.Credit ? (
              options && options.clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <Payments />
                </Elements>
              ) : (
                <Alert
                  message='Đơn hàng của bạn có giá trị nhỏ hơn 20000 hoặc hệ thống thanh toán bằng thẻ tín dụng hiện đang bị lỗi. Vui lòng chọn phương thức thanh toán khác'
                  type='error'
                />
              )
            ) : null}
            <hr />
            <h4 className='my-2 text-info'>
              <span className='mr-2'>
                <GiftOutlined />
              </span>
              MÃ GIẢM GIÁ
            </h4>
            <hr />
            <h4 className='my-3 text-info'>
              <span className='mr-2'>
                <FormOutlined />
              </span>
              GHI CHÚ
            </h4>
            <Form.Item>
              <Controller
                name='notes'
                control={control}
                render={({ field }) => (
                  <textarea
                    className='form-control'
                    rows={3}
                    placeholder='Thêm ghi chú (nếu có)'
                    {...field}></textarea>
                )}
              />
            </Form.Item>
            <hr />
            <div className='d-flex align-items-center justify-content-end'>
              <div className='w-50 text-right'>
                <div className='checkout-detail'>
                  <h4>TỔNG TIỀN:</h4>
                  <h4>
                    <NumericFormat value={totalBill} displayType='text' thousandSeparator=',' />
                  </h4>
                </div>
                <div className='checkout-detail'>
                  <span>Tổng tiền sản phẩm: </span>
                  <NumericFormat value={totalBill} displayType='text' thousandSeparator=',' />
                </div>
                <div className='checkout-detail'>
                  <span>Phí vận chuyển: </span>
                  <NumericFormat value={0} displayType='text' thousandSeparator=',' />
                </div>
              </div>
            </div>
            <hr />
            <div className='checkout-detail'>
              <NavLink to='/gio-hang-cua-toi'>
                <Button size='large' type='dashed' icon={<ArrowLeftOutlined />}>
                  Quay lại giỏ hàng
                </Button>
              </NavLink>
              <Button
                size='large'
                type='primary'
                className='ml-4'
                htmlType='submit'
                disabled={!totalBill}
                icon={<DollarCircleOutlined />}>
                Đặt hàng
              </Button>
            </div>
          </Form>
        </div>
        <hr />
        <h3 className='text-center'>CHI TIẾT ĐƠN HÀNG</h3>
        <div className='container'>
          <LtDynamicTable cols={tableColumns} dataSrc={products} rowKey='_id' />
        </div>
      </div>
    </>
  );
};

export default OrderPayment;
