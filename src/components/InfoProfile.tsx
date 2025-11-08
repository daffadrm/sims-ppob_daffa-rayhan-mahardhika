import { useEffect, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import BackgroundSaldo from "@/assets/images/BackgroundSaldo.png";
import DefaultProfile from "@/assets/images/DefaultProfile.png";
import { fetchProfile } from "@/features/profile/profileThunk";
import { fetchBalance } from "@/features/transaction/transactionThunk";
import { showAlert } from "@/store/alertStore";
import { AppDispatch, RootState } from "@/store/store";

export default function InfoProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const [showSaldo, setShowSaldo] = useState(false);

  const {
    profiles,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state: RootState) => state.profile);
  const {
    balances,
    loading: balanceLoading,
    error: transactionError,
  } = useSelector((state: RootState) => state.transactions);

  const globalError = profileError || transactionError;

  useEffect(() => {
    if (globalError)
      dispatch(showAlert({ message: globalError, severity: "error" }));
  }, [dispatch, globalError]);
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex flex-col gap-4 space-x-4">
          {profileLoading ? (
            <Skeleton variant="circular" width={64} height={64} />
          ) : (
            <img
              src={profiles?.profile_image || DefaultProfile}
              alt="avatar"
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.currentTarget.src = DefaultProfile;
              }}
            />
          )}
          <div>
            {profileLoading ? (
              <>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={180} height={28} />
              </>
            ) : (
              <>
                <p className="text-gray-500 text-xl">Selamat datang,</p>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profiles?.first_name + " " + profiles?.last_name}
                </h2>
              </>
            )}
          </div>
        </div>

        <div
          className=" flex flex-col gap-2 rounded-xl p-5 text-white overflow-hidden "
          style={{
            backgroundImage: `url(${BackgroundSaldo})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="text-sm">Saldo anda</p>
          {balanceLoading ? (
            <Skeleton variant="text" width={120} height={20} />
          ) : (
            <>
              <h3 className="text-3xl font-semibold">
                {showSaldo
                  ? `Rp ${balances?.balance?.toLocaleString("id-ID") || 0}`
                  : "Rp ••••••••"}
              </h3>
            </>
          )}
          <div className="mt-5 text-sm flex row gap-2">
            Lihat Saldo
            <div
              onClick={() => setShowSaldo((prev) => !prev)}
              className="text-white hover:text-gray-200 cursor-pointer"
            >
              {showSaldo ? (
                <VisibilityOff fontSize={"small"} />
              ) : (
                <Visibility fontSize={"small"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
