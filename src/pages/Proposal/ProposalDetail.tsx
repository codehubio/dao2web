/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import ProposalDetail from "../../components/Proposal/ProposalDetail";
import AppContext from "../../share/context";

export default function DetailProposal() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal Detail";
    setBreads(["Detail Proposal"]);
  }, []);
  return (
    <>
      <ProposalDetail />
    </>
  );
}
