import { useEffect } from "react";
import ProposalCreate from "../../components/Proposal/ProposalCreate";

export default function CreateProposal() {
  useEffect(() => {
    document.title = "Token Flow - Proposal Detail";
  }, []);
  return (
    <>
      <ProposalCreate />
    </>
  );
}
