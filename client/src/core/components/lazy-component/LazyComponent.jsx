import React, { Suspense } from 'react';

const LazyComponent = ({ component }) => {
  return (
    <>
      <Suspense fallback={<div>Loading....</div>}>{component}</Suspense>
    </>
  );
};

export default LazyComponent;
