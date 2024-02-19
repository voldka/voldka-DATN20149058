import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Space, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import LtDynamicTable from '../../core/components/lt-dynamic-table';
import LtFormDatePicker from '../../core/components/lt-form-date-picker';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import LtFormInput from '../../core/components/lt-form-input';
import LtFormModal from '../../core/components/lt-form-modal';
import LtFormTextArea from '../../core/components/lt-form-textarea';
import DiscountType from '../../shared/enums/discount-types.enum';
import PromotionsService from '../../shared/services/promotions.service';
import { actions } from '../../stores';

const DEFAULT_PROMOTION_VALUE = {
  title: '',
  desc: '',
  discountType: null,
  discountValue: null,
  expiredDate: null,
};

const discountTypeOptions = [
  {
    label: 'Tiền mặt',
    value: DiscountType.Money,
  },
  {
    label: 'Phần trăm giá trị đơn hàng',
    value: DiscountType.Percent,
  },
];

const Coupons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promotionId, setPromotionId] = useState(null);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { ...DEFAULT_PROMOTION_VALUE } });

  const getPromotions = async () => {
    try {
      dispatch(actions.showLoading());
      const data = await PromotionsService.getAll();
      setPromotions(data);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const openUpdateProductPromotion = async (promotion) => {
    reset({
      title: promotion.title,
      desc: promotion.desc,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      expiredDate: null,
    });
    setPromotionId(promotion._id);
    setIsUpdating(true);
    setIsOpen(true);
  };

  const createPromotion = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      const payload = {
        ...formValue,
        expiredDate: formValue.expiredDate.$d,
      };
      await PromotionsService.create(payload);
      handleCloseForm();
      getPromotions();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const updatePromotion = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      const payload = {
        ...formValue,
        expiredDate: formValue.expiredDate.$d,
      };
      await PromotionsService.update(promotionId, payload);
      handleCloseForm();
      getPromotions();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleCloseForm = () => {
    setIsUpdating(false);
    setPromotionId(null);
    setIsOpen(false);
    reset({ ...DEFAULT_PROMOTION_VALUE });
  };

  const handleSubmitCouponForm = (formValue) => {
    if (isUpdating) {
      updatePromotion(formValue);
    } else {
      createPromotion(formValue);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    Swal.fire({
      icon: 'question',
      title: 'Xoá Khuyến Mãi',
      text: 'Bạn có chắc là muốn xoá khuyến mãi này không?',
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: 'red',
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        try {
          dispatch(actions.showLoading());
          await PromotionsService.remove(promotionId);
          messageApi.success('Xoá loại sản phẩm thành công');
          getPromotions();
        } catch (error) {
          messageApi.error(error?.response?.data?.message || error.message);
        } finally {
          dispatch(actions.hideLoading());
        }
      }
    });
  };

  const tableColumns = useMemo(() => {
    return [
      {
        key: '1',
        title: 'ID',
        dataIndex: '_id',
        render: (value) => value.slice(-7, -1),
        align: 'center',
      },
      {
        key: '2',
        title: 'Tiêu đề',
        dataIndex: 'title',
        render: (value) => <span className='d-block overflow-hidden text-capitalize'>{value}</span>,
      },
      {
        key: '5',
        title: 'Giá trị',
        dataIndex: 'discountValue',
        render: (value, promotion) => (
          <span>
            {' '}
            <NumericFormat value={value} displayType='text' thousandSeparator=',' />
            {promotion.discountType === 'percent' ? '%' : ''}
          </span>
        ),
        align: 'center',
      },

      {
        key: '6',
        title: 'Ngày hết hạn',
        dataIndex: 'expiredDate',
        render: (value) => moment(value).format('DD/MM/YYYY'),
        align: 'center',
      },
      {
        key: '7',
        title: 'Tình trạng',
        dataIndex: 'expiredDate',
        render: (value) => (
          <span>
            {moment(value).isBefore(moment()) ? (
              <Tag color='red'>Đã hết hạn</Tag>
            ) : (
              <Tag color='green'>Còn hiệu lực</Tag>
            )}
          </span>
        ),
        align: 'center',
      },
      {
        key: '8',
        title: null,
        dataIndex: null,
        render: (_, promotion) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button
                size='large'
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => openUpdateProductPromotion(promotion)}
              />
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                danger
                size='large'
                z
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => handleDeletePromotion(promotion._id)}
              />
            </Tooltip>
          </Space>
        ),
        align: 'center',
      },
    ];
  }, [promotions.length]);

  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <>
      <div className='py-2'>
        {contextHolder}
        <Button size='large' type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
          Thêm mới
        </Button>
      </div>
      <LtDynamicTable
        hasFilters
        cols={tableColumns}
        dataSrc={promotions}
        rowKey='_id'
        searchByFields={['_id', 'title', 'desc']}
      />
      <LtFormModal
        isOpen={isOpen}
        title={isUpdating ? 'CẬP NHẬT KHUYẾN MÃI' : 'TẠO KHUYẾN MÃI'}
        okBtnText={isUpdating ? 'Cập nhật' : 'Thêm'}
        cancelBtnText='Huỷ'
        width='50vw'
        onCancel={handleCloseForm}
        onSubmit={handleSubmit(handleSubmitCouponForm)}>
        <Form layout='vertical' name='coupon-form'>
          <LtFormInput
            name='title'
            control={control}
            error={errors.title}
            label='Tiêu đề'
            placeholder='Nhập tiêu đề'
            rules={{
              required: 'Vui lòng nhập thông tin',
            }}
          />
          <LtFormTextArea
            name='desc'
            control={control}
            error={errors.desc}
            label='Mô tả'
            placeholder='Nhập mô tả'
            rules={{
              required: 'Vui lòng nhập thông tin',
            }}
          />
          <LtFormDropdown
            name='discountType'
            control={control}
            error={errors.discountType}
            label='Loại giảm giá'
            placeholder='Chọn lại giảm giá'
            dropdownOptions={discountTypeOptions}
            rules={{
              required: 'Vui lòng nhập thông tin',
            }}
          />
          <LtFormInput
            name='discountValue'
            control={control}
            error={errors.discountValue}
            label='Số tiền giảm'
            placeholder='Nhập số tiền giảm'
            rules={{
              required: 'Vui lòng nhập thông tin',
              validate: (value) => {
                const numericValue = parseFloat(value);
                const discountType = watch('discountType');
                if (isNaN(numericValue) || numericValue <= 0) {
                  return 'Giá trị giảm giá phải là số dương';
                }
                if (discountType === 'percent' && numericValue >= 100) {
                  return 'Giá trị giảm giá phải nhỏ hơn 100 nếu loại giảm giá là phần trăm';
                }
                return true;
              },
            }}
          />
          <LtFormDatePicker
            name='expiredDate'
            control={control}
            error={errors.expiredDate}
            label='Ngày hết hạn'
            placeholder='Nhập ngày hết hạn'
            rules={{
              required: 'Vui lòng nhập thông tin',
              validate: (value) => {
                const today = new Date();
                const selectedDate = value ? new Date(value._d || value) : null;

                return selectedDate && selectedDate >= today
                  ? true
                  : 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại';
              },
            }}
          />
        </Form>
      </LtFormModal>
    </>
  );
};

export default Coupons;
