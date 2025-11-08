import { useEffect, useState } from "react";

import { Wallet } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Logo from "@/assets/images/Logo.png";
import InfoProfile from "@/components/InfoProfile";
import ConfirmTopupModal from "@/components/Modal/Confirmation";
import ResultPaymentModal from "@/components/Modal/ResultPayment";
import { clearTransactionError } from "@/features/transaction/transactionSlice";
import { postTopup } from "@/features/transaction/transactionThunk";
import { showAlert } from "@/store/alertStore";
import { AppDispatch, RootState } from "@/store/store";

const TopUpPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    error: transactionError,
    loadingTopup,
    errorTopup,
  } = useSelector((state: RootState) => state.transactions);

  const globalError = transactionError;

  const [amount, setAmount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  const handleTopup = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    await dispatch(postTopup(amount));

    setShowConfirm(false);
    setShowResult(true);
    setError("");
  };

  const handleChange = (value: number | null) => {
    if (value === null) {
      setError("");
      setAmount(null);
      return;
    }

    if (value < 10000) {
      setError("Minimal top up adalah Rp10.000");
    } else if (value > 1000000) {
      setError("Maksimal top up adalah Rp1.000.000");
    } else {
      setError("");
    }

    setAmount(value);
  };

  useEffect(() => {
    if (globalError) {
      dispatch(showAlert({ message: globalError, severity: "error" }));
    }
  }, [dispatch, globalError]);

  useEffect(() => {
    dispatch(clearTransactionError());
  }, [dispatch]);

  return (
    <div>
      <InfoProfile />

      <div className="flex justify-center items-center mt-5">
        <div className="w-full">
          <div className="text-sm">Silahkan Masukkan</div>
          <h2 className="text-xl font-semibold mb-6">Nominal Top Up</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <TextField
                type="number"
                placeholder="Nominal Top Up"
                value={amount ? amount.toLocaleString("id-ID") : ""}
                size="small"
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  if (rawValue.length > 7) return;
                  const num = rawValue ? Number(rawValue) : null;
                  handleChange(num);
                }}
                error={!!error}
                helperText={error}
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
                  disabled={amount < 10000}
                  onClick={handleTopup}
                  className={`w-full rounded-xl font-semibold transition-all ${
                    amount >= 10000
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Top Up
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`rounded-xl text-sm font-medium  border ${
                    amount === val
                      ? "bg-primary text-white border-primary"
                      : " border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Rp{val.toLocaleString("ID-id")}
                </button>
              ))}
            </div>
          </div>

          {showConfirm && (
            <ConfirmTopupModal
              open={showConfirm}
              amount={amount}
              logo={Logo}
              onConfirm={handleConfirm}
              onCancel={() => setShowConfirm(false)}
              loading={loadingTopup}
            />
          )}

          {showResult && (
            <ResultPaymentModal
              open={showResult}
              status={errorTopup ? "error" : "success"}
              amount={amount}
              message={"Top Up sebesar"}
              onClose={() => {
                setShowResult(false);
                navigate("/");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;
