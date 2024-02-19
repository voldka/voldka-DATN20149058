import { LineChartOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import LtFormDatePicker from '../../core/components/lt-form-date-picker';
import LtFormDropdown from '../../core/components/lt-form-dropdown';
import { OrderStatus } from '../../shared/enums/order-status.enum';
import { StatisticService } from '../../shared/services/statistic.service';
import { actions } from '../../stores';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DEFAULT_FILTER_OPTIONS = {
  orderStatus: null,
  statisticBy: null,
  startDate: null,
  endDate: null,
};
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

const formatOptions = [
  {
    label: 'Ngày',
    value: 'date',
  },
  {
    label: 'Tháng',
    value: 'month',
  },
  {
    label: 'Năm',
    value: 'year',
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { ...DEFAULT_FILTER_OPTIONS },
  });

  const handleCalculateStatistic = async (formValues) => {
    const filterOptions = {
      ...formValues,
      startDate:
        formValues.startDate && formValues.startDate.$d ? formValues.startDate.$d : undefined,
      endDate: formValues.endDate && formValues.endDate.$d ? formValues.endDate.$d : undefined,
    };

    try {
      dispatch(actions.showLoading());
      const orders = await StatisticService.getStatistics(filterOptions);
      console.log(orders);

      if (orders.length > 1) {
        const labels = [];
        const dataPoints = [];
        orders.forEach((item) => {
          const date = Object.keys(item)[0];
          const value = item[date];
          labels.push(date);
          dataPoints.push(value);
        });
        setChartData({
          ...chartData,
          labels: labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: dataPoints,
              backgroundColor: getRandomColor(),
            },
          ],
        });
      } else {
        const labels = Object.keys(orders);
        const dataPoints = Object.values(orders);

        setChartData({
          ...chartData,
          labels: labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: dataPoints,
              backgroundColor: getRandomColor(),
              barPercentage: 1, // Set to 1 to use the specified pixel width
              categoryPercentage: 0.5, // Adjust as needed
              barThickness: 60, // Set the desired pixel widt
            },
          ],
        });
      }
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const options = {
    scales: {
      x: {
        title: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      {contextHolder}
      <Form
        layout='vertical'
        className='search-bar-form'
        onFinish={handleSubmit(handleCalculateStatistic)}>
        <div className='row' style={{ alignItems: 'center' }}>
          <div className='col-md-3 col-xs-12'>
            <LtFormDatePicker
              label='Từ ngày'
              name='startDate'
              control={control}
              placeholder='Từ ngày'
              error={errors.startDate}
              
              rules={{
                required: 'Vui lòng chọn giá trị',
              }}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <LtFormDatePicker
              label='Đến ngày'
              name='endDate'
              control={control}
              placeholder='Đến ngày'
              error={errors.endDate}
              rules={{
                required: 'Vui lòng chọn giá trị',
              }}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <LtFormDropdown
              label='Thống kê theo'
              placeholder='Chọn hình thức thống kê'
              name='statisticBy'
              control={control}
              error={errors.statisticBy}
              dropdownOptions={formatOptions}
              rules={{
                required: 'Vui lòng chọn giá trị',
              }}
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
              rules={{
                required: 'Vui lòng chọn giá trị',
              }}
            />
          </div>
        </div>
        <div className='text-center'>
          <Button htmlType='submit' type='primary' size='large' icon={<LineChartOutlined />}>
            Thống Kê
          </Button>
        </div>
      </Form>
      <div className='pt-3'>
        <Bar data={chartData} options={options} />
      </div>
    </>
  );
};

export default Dashboard;
