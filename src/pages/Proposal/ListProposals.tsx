/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import MyGrid from "../../components/MyGrid";
import { BoltOutlined } from "@mui/icons-material";
import ProposalCreateDialog from "../../components/Dialog/CreateProposalDialog";
import { useDispatch } from "react-redux";
import { listProposalsThunk } from "../../reducers/proposal";
import ListMyProposal from "../../components/Proposal/ListProposal";
import { TListProposalFilter } from "../../services/state/proposal";
import ProposalListFilters from "../../components/ProposalFilters";

export default function ListProposals() {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  // const [assets, setAssets] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const { address } = useParams();
  const [proposals, setProposalList] = useState([]);
  const [reload, setShouldReloase] = useState(false);
  const [proposalFilters, setProposalFilters]: [
    TListProposalFilter & { isMyProposal?: boolean; isInvolved?: boolean },
    Function
  ] = useState({});
  const dispatch = useDispatch();
  const addressPubkey = address || wallet?.adapter.publicKey?.toBase58();
  useEffect(() => {
    async function getAssets() {
      setLoadingMessage("loading assets ...");
      console.log(proposalFilters);
      try {
        proposalFilters.creator = proposalFilters.isMyProposal
          ? addressPubkey
          : "";
        proposalFilters.involve = proposalFilters.isInvolved
          ? addressPubkey
          : "";
        const { payload } = await dispatch(
          listProposalsThunk({
            endpoint: connection.rpcEndpoint,
            options: proposalFilters,
          } as any) as any
        );
        setProposalList(payload);
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getAssets();
  }, [addressPubkey, reload, proposalFilters]);
  function changeCreateDialogState() {
    setOpenCreate(!openCreate);
  }

  return (
    <>
      <ProposalCreateDialog
        open={openCreate}
        reloadFn={setShouldReloase}
        handleClose={changeCreateDialogState}
      />
      <Button
        onClick={changeCreateDialogState}
        color="primary"
        variant="contained"
        startIcon={<BoltOutlined />}
      >
        Create new proposal
      </Button>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <ProposalListFilters
          filters={proposalFilters}
          setFilters={setProposalFilters}
        />

        <MyGrid direction="row">
          <ListMyProposal proposals={proposals} />
        </MyGrid>
      </Stack>
    </>
  );
}
