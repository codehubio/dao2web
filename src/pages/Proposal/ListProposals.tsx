/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import ListMyProposal from "../../components/Proposal/ProposalList";
export default function ListProposals() {
  useEffect(() => {
    document.title = "Token Flow - Proposal List";
  }, []);
  return (
    <>
      <ListMyProposal />
    </>
  );
}
