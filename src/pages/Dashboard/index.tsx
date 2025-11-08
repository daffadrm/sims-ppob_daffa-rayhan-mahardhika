import { useEffect, useState } from "react";

import { Wallet } from "@mui/icons-material";
import { InputAdornment, Skeleton, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

import Logo from "@/assets/images/Logo.png";
import InfoProfile from "@/components/InfoProfile";
import ConfirmationModal from "@/components/Modal/Confirmation";
import ResultPaymentModal from "@/components/Modal/ResultPayment";
import { setSelectedService } from "@/features/information/infoSlice";
import {
  infoBannerThunk,
  infoServicesThunk,
} from "@/features/information/infoThunk";
import { clearTransactionError } from "@/features/transaction/transactionSlice";
import { postTransaction } from "@/features/transaction/transactionThunk";
import { showAlert } from "@/store/alertStore";
import { AppDispatch, RootState } from "@/store/store";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    banners,
    loading: InfoLoading,
    services,
    error: infoError,
    selectedService,
  } = useSelector((state: RootState) => state.info);

  const { loadingTransaction, errorTransaction } = useSelector(
    (state: RootState) => state.transactions
  );

  const [amount, setAmount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleService = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    await dispatch(postTransaction(selectedService?.service_code));

    setShowConfirm(false);
    setShowResult(true);
  };

  const globalError = infoError || errorTransaction;

  useEffect(() => {
    if (globalError)
      dispatch(showAlert({ message: globalError, severity: "error" }));
  }, [dispatch, globalError]);

  useEffect(() => {
    dispatch(infoBannerThunk());
    dispatch(infoServicesThunk());
    dispatch(clearTransactionError());
  }, [dispatch]);

  useEffect(() => {
    if (selectedService?.service_tariff) {
      setAmount(selectedService.service_tariff);
    }
  }, [selectedService]);

  return (
    <div>
      <InfoProfile />
      {selectedService ? (
        <div className="flex justify-center items-center mt-5">
          <div className="w-full">
            <div className="text-sm mb-2">PemBayaran</div>
            <div className="flex flex-row gap-2 mb-6">
              <div className="w-10 h-10  items-center justify-center bg-white rounded-xl  ">
                <img
                  src={selectedService?.service_icon}
                  alt={selectedService?.service_name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold flex items-center">
                {selectedService?.service_name}
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <TextField
                type="number"
                placeholder="Nominal Top Up"
                value={amount ? amount.toLocaleString("id-ID") : ""}
                size="small"
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Wallet />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />

              <div className="flex">
                <button
                  disabled={!amount}
                  onClick={handleService}
                  className={`w-full rounded-xl font-semibold transition-all ${
                    amount >= 10000
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Bayar
                </button>
              </div>
            </div>

            {showConfirm && (
              <ConfirmationModal
                open={showConfirm}
                amount={amount}
                logo={Logo}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirm(false)}
                loading={loadingTransaction}
                type="transaction"
              />
            )}

            {showResult && (
              <ResultPaymentModal
                open={showResult}
                status={errorTransaction ? "error" : "success"}
                amount={amount}
                message={`Pembayaran ${selectedService?.service_name} sebesar`}
                onClose={() => {
                  setShowResult(false);
                  dispatch(setSelectedService(null));
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4 mb-10">
            {InfoLoading ? (
              <>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={150} height={30} />
              </>
            ) : (
              <>
                {services?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center space-y-1 hover:scale-105 transition"
                    onClick={() => {
                      dispatch(setSelectedService(item));
                    }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow">
                      <img
                        src={item?.service_icon}
                        alt={item?.service_icon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center  h-10">
                      {item.service_name}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-4">Temukan promo menarik</h3>
          <Slider {...settings} className="promo-slider">
            {banners?.map((promo, index) => (
              <div key={index} className="">
                <div
                  className={
                    "rounded-xl overflow-hidden shadow hover:shadow-lg items-center"
                  }
                >
                  <img
                    src={promo?.banner_image}
                    alt={promo?.banner_name}
                    className="w-full h-33 object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
