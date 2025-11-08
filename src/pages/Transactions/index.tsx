import { useEffect } from "react";

import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import InfoProfile from "@/components/InfoProfile";
import { resetTransactions } from "@/features/transaction/transactionSlice";
import { fetchTransactionsHistory } from "@/features/transaction/transactionThunk";
import { showAlert } from "@/store/alertStore";
import { AppDispatch, RootState } from "@/store/store";

const TransactionPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    error: transactionError,

    transactionsHistory,
    limit,
    offset,
    loadingGetHistory,
    moreHistory,
  } = useSelector((state: RootState) => state.transactions);

  const globalError = transactionError;

  useEffect(() => {
    if (globalError)
      dispatch(showAlert({ message: globalError, severity: "error" }));
  }, [dispatch, globalError]);

  useEffect(() => {
    dispatch(resetTransactions());
    dispatch(fetchTransactionsHistory({ offset: 0, limit }));
  }, [dispatch, limit]);

  const handleShowMore = () => {
    dispatch(fetchTransactionsHistory({ offset: offset + limit, limit }));
  };

  return (
    <div>
      <InfoProfile />
      <div className="font-bold text-xl mb-4">Semua Transaksi</div>

      <Box display="flex" flexDirection="column" gap={2}>
        {transactionsHistory?.map((tx, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            p={1}
            border="1px solid #e0e0e0"
            borderRadius={2}
          >
            <Box>
              <Typography
                variant="subtitle1"
                color={tx?.transaction_type === "TOPUP" ? "success" : "primary"}
              >
                {tx?.transaction_type === "TOPUP" ? "+" : "-"} Rp.
                {tx?.total_amount.toLocaleString("id-ID")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {moment(tx?.created_on).format("DD MMMM YYYY, HH:mm")} WIB
              </Typography>
            </Box>
            <Typography variant="body2">{tx?.description}</Typography>
          </Box>
        ))}
      </Box>
      {moreHistory && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="text" onClick={handleShowMore}>
            {loadingGetHistory ? "Loading..." : "Show More"}
          </Button>
        </Box>
      )}
    </div>
  );
};

export default TransactionPage;
