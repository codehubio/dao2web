/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import MyGrid from "../../components/MyGrid";
import { BoltOutlined } from "@mui/icons-material";
import ProposalCreateDialog from "../../components/Proposal/CreateProposalDialog";
import { useSelector, useDispatch } from "react-redux";
import { listProposalsByInvolveThunk } from "../../reducers/proposal";
import ListProposalInfo from "../../components/Proposal/ListInfo";

export default function ListInvolveProposals() {
  const assets = useSelector(
    ({ proposalReducer: { involveProposals } }: any) => involveProposals
  );
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  // const [assets, setAssets] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const { address } = useParams();
  const [reload, setShouldReloase] = useState(false);
  const dispatch = useDispatch();
  const addressPubkey = address || wallet?.adapter.publicKey?.toBase58();
  useEffect(() => {
    async function getAssets() {
      setLoadingMessage("loading assets ...");
      try {
        await dispatch(
          listProposalsByInvolveThunk({
            endpoint: connection.rpcEndpoint,
            address: addressPubkey,
          } as any) as any
        );
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getAssets();
  }, [addressPubkey, reload]);
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
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          onClick={changeCreateDialogState}
          color="primary"
          variant="contained"
          startIcon={<BoltOutlined />}
        >
          create new proposal
        </Button>
        <MyGrid direction="row">
          <ListProposalInfo proposals={assets} />
        </MyGrid>
      </Stack>
    </>
  );
}
