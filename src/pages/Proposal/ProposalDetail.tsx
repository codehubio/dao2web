import { useEffect } from "react";
import ProposalDetail from "../../components/Proposal/ProposalDetail";

export default function DetailProposal() {
  useEffect(() => {
    document.title = "Token Flow - Proposal Detail";
  }, []);
  return (
    <>
      <ProposalDetail />
    </>
  );
}
