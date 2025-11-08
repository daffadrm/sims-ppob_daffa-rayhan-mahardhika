import React from "react";

import { Cancel, CheckCircleSharp } from "@mui/icons-material";

interface ResultPaymentModalProps {
  open: boolean;
  status: "success" | "error";
  message?: string;
  amount?: number | null;
  onClose: () => void;
}

const ResultPaymentModal: React.FC<ResultPaymentModalProps> = ({
  open,
  status,
  message,
  amount,
  onClose,
}) => {
  if (!open) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
        <div className="mb-3">
          {isSuccess ? (
            <CheckCircleSharp fontSize="large" color="success" />
          ) : (
            <Cancel color="error" fontSize={"large"} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm">{message}</div>
          <p className="font-bold">Rp {amount?.toLocaleString("id-ID")}</p>
          <div className="mb-5 font-sm">{isSuccess ? "berhasil" : "gagal"}</div>
        </div>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-lg text-primary hover:opacity-90 transition`}
        >
          Kembali ke beranda
        </button>
      </div>
    </div>
  );
};

export default ResultPaymentModal;
