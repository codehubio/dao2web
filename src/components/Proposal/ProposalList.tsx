/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { Button, Stack, TableRow, Typography } from "@mui/material";
import ProposalRow from "./ProposalRow";
import ProposalCreateDialog from "../Dialog/CreateProposalDialog";
import { useContext, useEffect, useState } from "react";
import { BoltOutlined } from "@mui/icons-material";
import ProposalListFilters from "../ProposalFilters";
import { TListProposalFilter } from "../../services/state/proposal";
import { useDispatch } from "react-redux";
import { listProposalsThunk } from "../../reducers/proposal";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useParams } from "react-router-dom";
export default function ListProposalInfo() {
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [proposals, setProposalList] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [reload, setShouldReload] = useState(false);
  const [proposalFilters, setProposalFilters]: [
    TListProposalFilter & { isMyProposal?: boolean; isInvolved?: boolean },
    Function
  ] = useState({});
  const dispatch = useDispatch();
  const { address } = useParams();
  const addressPubkey = address || wallet?.adapter.publicKey?.toBase58();
  useEffect(() => {
    async function getAssets() {
      setLoadingMessage("loading assets ...");
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
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <ProposalCreateDialog
          open={openCreate}
          reloadFn={setShouldReload}
          handleClose={changeCreateDialogState}
        />
        {wallet?.adapter.connected ? (
          <Button
            onClick={changeCreateDialogState}
            color="primary"
            variant="contained"
            startIcon={<BoltOutlined />}
          >
            Create new proposal
          </Button>
        ) : (
          <Typography variant="body1">
            Please connect to your wallet!
          </Typography>
        )}
        <Typography variant="h4">Proposals list</Typography>

        <ProposalListFilters
          filters={proposalFilters}
          setFilters={setProposalFilters}
        />

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left"># of txs</TableCell>
                <TableCell align="left"># of approvals</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((proposal: any, index: number) => {
                return <ProposalRow key={index} proposal={proposal} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
