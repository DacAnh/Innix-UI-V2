import React from 'react';
import { useCheckout } from './hooks/useCheckout';
import CheckoutForm from './components/CheckoutForm';
import FinalBookingSummary from './components/FinalBookingSummary';
import Loader from '../../components/share/loader/loader';
import Toast from '../../components/share/toast/Toast';

const Checkout = () => {
  // Gọi Hook để lấy toàn bộ logic & state
  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isLoading,
    isSubmitDisabled,
    toastMessage,
    setToastMessage,
    displayInfo,
  } = useCheckout();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 py-10">
      {isLoading && (
        <Loader
          isFullScreen={true}
          loaderText={'Đang chuyển hướng sang VNPAY...'}
        />
      )}

      {/* Component Tóm tắt */}
      <FinalBookingSummary
        hotelName={displayInfo.hotelName}
        checkIn={displayInfo.checkInDisplay}
        checkOut={displayInfo.checkOutDisplay}
        isAuthenticated={displayInfo.isAuthenticated}
        phone={formData.phone}
        email={formData.email}
        fullName={formData.fullName}
      />

      {/* Component Form */}
      <CheckoutForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isSubmitDisabled={isSubmitDisabled}
        total={displayInfo.total}
      />

      {toastMessage && (
        <div className="mt-4">
          <Toast
            message={toastMessage}
            type={'error'}
            dismissError={() => setToastMessage('')}
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
