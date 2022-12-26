import { useEffect } from "react";
import TransactionDetail from "../../components/Transaction/TransactionDetail";

export default function DetailTransaction() {
  useEffect(() => {
    document.title = "Token Flow - Transaction Detail";
  }, []);
  return (
    <>
      <TransactionDetail />
    </>
  );
}
