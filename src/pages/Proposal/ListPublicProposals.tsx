/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import ListProposal from "../../components/Proposal/ProposalList";
import AppContext from "../../share/context";
export default function ListPublicProposals() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal List";
    setBreads(["Public Proposals"]);
  }, []);
  return (
    <>
      <ListProposal isPublic={true} />
    </>
  );
}
