import { Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import LtFormDropdown from '../../../core/components/lt-form-dropdown';
import { DeliveryStatus } from '../../../shared/enums/delivery-status.enum';
import { OrderStatus } from '../../../shared/enums/order-status.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';

const deliveryStatusOptions = [
  {
    label: DeliveryStatus.IN_PROGRESS,
    value: DeliveryStatus.IN_PROGRESS,
  },
  {
    label: DeliveryStatus.DELIVERED_SUCCESS,
    value: DeliveryStatus.DELIVERED_SUCCESS,
  },
  {
    label: DeliveryStatus.DELIVERED_FAILED,
    value: DeliveryStatus.DELIVERED_FAILED,
  },
];

const paymentMethodStatusOptions = [
  {
    label: PaymentStatus.NOT_YET_PAY,
    value: PaymentStatus.NOT_YET_PAY,
  },
  {
    label: PaymentStatus.PAID,
    value: PaymentStatus.PAID,
  },
  {
    label: PaymentStatus.REFUNDED,
    value: PaymentStatus.REFUNDED,
  },
];

const orderStatusOptions = [
  {
    label: OrderStatus.IN_PROGRESS,
    value: OrderStatus.IN_PROGRESS,
  },
  {
    label: OrderStatus.SUCCESS,
    value: OrderStatus.SUCCESS,
  },
  {
    label: OrderStatus.FAILED,
    value: OrderStatus.FAILED,
  },
];

const UpdateOrder = ({ order, onUpdateOrder, onCancelUpdate }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      orderStatus: null,
      deliveryStatus: null,
      paymentStatus: null,
      notes: '',
    },
  });

  const handleSubmitUpdateOrderForm = async (formValue) => {
    onUpdateOrder({ ...formValue, notes: formValue.notes.trim() });
  };

  useEffect(() => {
    if (order) {
      reset({
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryStatus,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
      });
    }
  }, [order]);

  useEffect(() => {
    const orderStatus = watch('orderStatus');
    switch (orderStatus) {
      case OrderStatus.SUCCESS: {
        setIsDisabled(true);
        setValue('deliveryStatus', DeliveryStatus.DELIVERED_SUCCESS);
        setValue('paymentStatus', PaymentStatus.PAID);
        break;
      }
      case OrderStatus.FAILED: {
        setIsDisabled(true);
        setValue('deliveryStatus', DeliveryStatus.DELIVERED_FAILED);
        if (watch('paymentStatus') === PaymentStatus.PAID) {
          setValue('paymentStatus', PaymentStatus.REFUNDED);
        }
        break;
      }
      default: {
        setIsDisabled(false);
        setValue('deliveryStatus', order.deliveryStatus);
        setValue('paymentStatus', order.paymentStatus);
        break;
      }
    }
  }, [watch('orderStatus')]);

  return (
    <>
      <Form
        name='update-order-form'
        layout='vertical'
        className='search-bar-form'
        onFinish={handleSubmit(handleSubmitUpdateOrderForm)}>
        <LtFormDropdown
          allowClear={false}
          label='Trạng thái đơn hàng'
          placeholder='Trạng thái đơn hàng'
          name='orderStatus'
          control={control}
          error={errors.orderStatus}
          dropdownOptions={orderStatusOptions}
        />
        <LtFormDropdown
          isDisabled={isDisabled}
          allowClear={false}
          label='Trạng thái thanh toán'
          placeholder='Trạng thái thanh toán'
          name='paymentStatus'
          control={control}
          error={errors.paymentStatus}
          dropdownOptions={paymentMethodStatusOptions}
        />
        <LtFormDropdown
          isDisabled={isDisabled}
          allowClear={false}
          label='Trạng thái vận chuyển'
          placeholder='Trạng thái vận chuyển'
          name='deliveryStatus'
          control={control}
          error={errors.deliveryStatus}
          dropdownOptions={deliveryStatusOptions}
        />
        <Form.Item label='Ghi chú'>
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
        <div className='py-2 d-flex justify-content-between align-items-center'>
          <Button size='large' type='dashed' onClick={onCancelUpdate}>
            Đóng
          </Button>
          <Button size='large' type='primary' htmlType='submit'>
            Cập nhật
          </Button>
        </div>
      </Form>
    </>
  );
};

export default UpdateOrder;
