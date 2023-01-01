/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import ListMyProposal from "../../components/Proposal/ProposalList";
import AppContext from "../../share/context";
export default function ListProposals() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Token Flow - Proposal List";
    setBreads(["Home", "List Proposals"]);
  }, []);
  return (
    <>
      <ListMyProposal />
    </>
  );
}
