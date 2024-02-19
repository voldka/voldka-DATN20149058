import { Spin } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../stores';
import styles from './styles.module.scss';

const LoadingSpinner = () => {
  const isLoading = useSelector(selectors.selectIsLoading);
  return (
    <>
      {isLoading && (
        <div className={styles.spinner}>
          <Spin size='large' />
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
