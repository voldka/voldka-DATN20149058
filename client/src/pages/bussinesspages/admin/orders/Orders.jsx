import { ClearOutlined, DollarOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Image, Table, Tag, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useDispatch } from 'react-redux';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import LtFormDatePicker from '../../core/components/lt-form-date-picker';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import LtFormInput from '../../core/components/lt-form-input';
import LtFormModal from '../../core/components/lt-form-modal';
import { DeliveryStatus } from '../../shared/enums/delivery-status.enum';
import { OrderStatus } from '../../shared/enums/order-status.enum';
import { PaymentMethods } from '../../shared/enums/payment-methods.enum';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { OrdersService } from '../../shared/services/orders.service';
import { actions } from '../../stores';
import UpdateOrder from './update-order/UpdateOrder';
import Swal from 'sweetalert2';

const colorMap = {
  [PaymentStatus.NOT_YET_PAY]: 'orange',
  [PaymentStatus.PAID]: 'green',
  [DeliveryStatus.IN_PROGRESS]: 'blue',
  [DeliveryStatus.DELIVERED_SUCCESS]: 'green',
  [DeliveryStatus.DELIVERED_FAILED]: 'red',
  [OrderStatus.IN_PROGRESS]: 'blue',
  [OrderStatus.SUCCESS]: 'green',
  [OrderStatus.FAILED]: 'red',
};

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

const paymentMethodOptions = [
  {
    label: PaymentMethods.CashOnDelivery,
    value: PaymentMethods.CashOnDelivery,
  },
  {
    label: PaymentMethods.Credit,
    value: PaymentMethods.Credit,
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

const DEFAULT_FILTER_OPTIONS = {
  search: '',
  paymentMethod: null,
  paymentStatus: null,
  orderStatus: null,
  startDate: null,
  endDate: null,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ ...DEFAULT_FILTER_OPTIONS });
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { ...DEFAULT_FILTER_OPTIONS },
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleClearFilterOptions = () => {
    reset({ ...DEFAULT_FILTER_OPTIONS });
    setFilterOptions({ ...DEFAULT_FILTER_OPTIONS });
  };

  const handleOpenUpdateOrderDialog = (order) => {
    setIsOpen(true);
    setSelectedOrder(order);
  };

  const handleCloseUpdateOrderDialog = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  const handleSearchProducts = (formValues) => {
    setFilterOptions({ ...formValues });
  };

  const handleUpdateOrder = async (changes) => {
    try {
      dispatch(actions.showLoading());
      const updatedOrders = await OrdersService.updateOrder(selectedOrder._id, changes);
      const orderIdx = orders.findIndex((o) => o._id === updatedOrders._id);
      if (orderIdx !== -1) {
        orders[orderIdx] = JSON.parse(JSON.stringify(updatedOrders));
        setOrders([...orders]);
      }
      setIsOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleRefund = (order) => {
    Swal.fire({
      icon: 'question',
      title: 'Xác nhận Hoàn Tiền',
      text: order.notes,
      showCancelButton: true,
      cancelButtonText: 'Đóng',
      confirmButtonText: 'Xác nhận',
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        try {
          dispatch(actions.showLoading());
          const updatedOrders = await OrdersService.updateOrder(order._id, {
            paymentStatus: PaymentStatus.REFUNDED,
          });
          const orderIdx = orders.findIndex((o) => o._id === updatedOrders._id);
          if (orderIdx !== -1) {
            orders[orderIdx] = JSON.parse(JSON.stringify(updatedOrders));
            setOrders([...orders]);
          }
        } catch (error) {
          messageApi.error(error?.response?.data?.message || error.message);
        } finally {
          dispatch(actions.hideLoading());
        }
      }
    });
  };

  const getOrders = async () => {
    try {
      dispatch(actions.showLoading());
      const orders = await OrdersService.getOrders(filterOptions);
      setOrders(orders);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const mainTableColumns = useMemo(() => {
    return [
      {
        title: 'ID',
        key: '_id',
        dataIndex: '_id',
        render: (value) => value.slice(0, 8),
        align: 'center',
      },
      {
        title: 'Người đặt',
        key: 'fullName',
        dataIndex: 'fullName',
      },
      {
        title: 'SĐT',
        key: 'phone',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: 'Tình trạng',
        key: 'orderStatus',
        dataIndex: 'orderStatus',
        render: (value) => (
          <Tag color={colorMap[value]}>
            <span className='text-capitalize'>{value}</span>
          </Tag>
        ),
        align: 'center',
      },
      {
        title: 'Tổng tiền',
        key: 'totalBill',
        dataIndex: 'totalBill',
        render: (value) => <NumericFormat value={value} displayType='text' thousandSeparator=',' />,
        align: 'center',
      },
      {
        title: 'Ngày đặt',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (value) => moment(value).format('HH:mm - DD/MM/YYYY'),
        align: 'center',
      },
      {
        title: 'Ghi chú',
        key: 'notes',
        dataIndex: 'notes',
        render: (value) => (
          <div
            style={{
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
            {value}
          </div>
        ),
      },
      {
        title: '',
        key: 'actions',
        dataIndex: null,
        render: (_, order) => (
          <>
            {order.orderStatus === OrderStatus.IN_PROGRESS && (
              <Button
                size='large'
                type='primary'
                icon={<EditOutlined />}
                onClick={() => handleOpenUpdateOrderDialog(order)}>
                Xử lý
              </Button>
            )}
            {order.orderStatus === OrderStatus.FAILED &&
              order.paymentStatus === PaymentStatus.PAID && (
                <Button
                  size='large'
                  type='primary'
                  icon={<DollarOutlined />}
                  onClick={() => handleRefund(order)}>
                  Hoàn tiền
                </Button>
              )}
          </>
        ),
        align: 'center',
      },
    ];
  }, [orders]);

  const subTableColumns = useMemo(() => {
    return [
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
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
      },
    ];
  }, []);

  useEffect(() => {
    getOrders();
  }, [filterOptions]);

  return (
    <>
      {contextHolder}
      <Form
        layout='vertical'
        className='search-bar-form'
        onFinish={handleSubmit(handleSearchProducts)}>
        <div className='row'>
          <div className='col-md-12 col-xs-12'>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <LtFormInput
                  label='Tìm đơn hàng'
                  placeholder='Mã đơn hàng, tên, số điện thoại'
                  name='search'
                  control={control}
                  error={errors.search}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <LtFormDropdown
                  label='Trạng thái đơn hàng'
                  placeholder='Trạng thái đơn hàng'
                  name='orderStatus'
                  control={control}
                  error={errors.orderStatus}
                  dropdownOptions={orderStatusOptions}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <LtFormDatePicker
                  label='Từ ngày'
                  name='startDate'
                  control={control}
                  placeholder='Từ ngày'
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <LtFormDatePicker
                  label='Đến ngày'
                  name='endDate'
                  control={control}
                  placeholder='Đến ngày'
                />
              </div>
            </div>
          </div>
          <div className='col-md-3 col-xs-12'>
            <LtFormDropdown
              label='Trạng thái vận chuyển'
              placeholder='Trạng thái vận chuyển'
              name='deliveryStatus'
              control={control}
              error={errors.deliveryStatus}
              dropdownOptions={deliveryStatusOptions}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <LtFormDropdown
              label='Hình thức thanh toán'
              placeholder='Hình thức thanh toán'
              name='paymentMethod'
              control={control}
              error={errors.paymentMethod}
              dropdownOptions={paymentMethodOptions}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <LtFormDropdown
              label='Trạng thái thanh toán'
              placeholder='Trạng thái thanh toán'
              name='paymentStatus'
              control={control}
              error={errors.paymentStatus}
              dropdownOptions={paymentMethodStatusOptions}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <div className='flex ai-center jc-start h-100'>
              <Button htmlType='submit' type='primary' size='large' icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
              <Button
                danger
                className='ml-3'
                htmlType='button'
                type='primary'
                size='large'
                icon={<ClearOutlined />}
                onClick={handleClearFilterOptions}>
                Bỏ lọc
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <div className='pt-4 px-3'>
        <Table
          rowKey='_id'
          columns={mainTableColumns}
          dataSource={orders}
          pagination={{ pageSize: 12, hideOnSinglePage: true }}
          expandable={{
            expandedRowRender: (order) => (
              <>
                {order.orderStatus === OrderStatus.FAILED && (
                  <Descriptions title='Lý do huỷ' column={1}>
                    <Descriptions.Item label=''>
                      <em>{order.notes}</em>
                    </Descriptions.Item>
                  </Descriptions>
                )}
                <Descriptions title='Thông tin thanh toán' column={1}>
                  <Descriptions.Item label='Hình thức thanh toán'>
                    <span className='text-capitalize'>{order.paymentMethod}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái'>
                    <Tag color={colorMap[order.paymentStatus]}>
                      <span className='text-capitalize'>{order.paymentStatus}</span>
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Thông tin vận chuyển' column={1}>
                  <Descriptions.Item label='Hình thức vận chuyển'>
                    <span className='text-capitalize'>{order.deliveryType}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label='Tình trạng'>
                    <Tag color={colorMap[order.deliveryStatus]}>
                      <span className='text-capitalize'>{order.deliveryStatus}</span>
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions title='Thông tin người nhận' column={1}>
                  <Descriptions.Item label='Người nhận'>{order.fullName}</Descriptions.Item>
                  <Descriptions.Item label='Số điện thoại'>{order.phone}</Descriptions.Item>
                  <Descriptions.Item label='Địa chỉ giao hàng'>
                    {order.deliveryAddress}
                  </Descriptions.Item>
                </Descriptions>
                <hr />
                <h5 className='text-center page-title'>Chi Tiết Sản Phẩm</h5>
                <LtDynamicTable cols={subTableColumns} dataSrc={order.products} rowKey='_id' />
              </>
            ),
          }}
        />
      </div>
      <LtFormModal
        isOpen={isOpen}
        title={`CẬP NHẬT ĐƠN HÀNG #${selectedOrder && selectedOrder._id.slice(0, 8)}`}
        onCancel={handleCloseUpdateOrderDialog}
        isUseDefaultFooter={false}
        width='50vw'>
        <UpdateOrder
          order={selectedOrder}
          onUpdateOrder={handleUpdateOrder}
          onCancelUpdate={handleCloseUpdateOrderDialog}
        />
      </LtFormModal>
    </>
  );
};

export default Orders;
