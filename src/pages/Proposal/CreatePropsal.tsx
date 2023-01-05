/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import ProposalCreate from "../../components/Proposal/ProposalCreate";
import AppContext from "../../share/context";

export default function CreateProposal() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal Detail";
    setBreads(["Create Proposal"]);
  }, []);
  return (
    <>
      <ProposalCreate />
    </>
  );
}
