import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';

const Payments = () => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <>
      <PaymentElement />
    </>
  );
};

export default Payments;
