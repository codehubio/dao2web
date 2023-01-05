import { useContext, useEffect } from "react";
import TransactionDetail from "../../components/Transaction/TransactionDetail";
import AppContext from "../../share/context";

export default function DetailTransaction() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Transaction Detail";
    setBreads(["Detail Transaction"]);
  }, []);
  return (
    <>
      <TransactionDetail />
    </>
  );
}
