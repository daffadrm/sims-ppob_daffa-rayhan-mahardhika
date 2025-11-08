import React from "react";

interface ConfirmationModalProps {
  open: boolean;
  amount: number | null;
  onConfirm: () => void;
  onCancel: () => void;
  logo?: string;
  loading: boolean;
  type?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  amount,
  onConfirm,
  onCancel,
  logo,
  loading,
  type,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
        {logo && (
          <div className="flex justify-center mb-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
          </div>
        )}
        <h3 className="text-sm mb-3">Apakah yakin untuk Top Up sebesar</h3>
        <p className="mb-5">
          <span className="font-bold">
            Rp{amount?.toLocaleString("id-ID")} ?
          </span>
        </p>
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-primary  hover:bg-primary/10 transition"
          >
            Ya, lanjutkan {type === "transaction" ? "bayar" : "Top Up"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-gray-500  border-gray-300 hover:bg-gray-100 transition"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
