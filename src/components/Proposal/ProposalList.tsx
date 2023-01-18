/* eslint-disable react-hooks/exhaustive-deps */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import {
  Stack,
  TablePagination,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import ProposalRow from "./ProposalRow";
import { useContext, useEffect, useState } from "react";
import ProposalListFilters from "../ProposalFilters";
import { TListProposalFilter } from "../../services/state/proposal";
import { useDispatch } from "react-redux";
import { listProposalsThunk } from "../../reducers/proposal";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useParams } from "react-router-dom";
import { SystemProgram } from "@solana/web3.js";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
export default function ListProposalInfo({
  isMyProposal,
  isInvolved,
  isPublic,
}: {
  isMyProposal?: boolean;
  isInvolved?: boolean;
  isPublic?: boolean;
}) {
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [proposals, setProposalList] = useState([]);
  const [proposalFilters, setProposalFilters]: [
    TListProposalFilter & { isMyProposal?: boolean; isInvolved?: boolean },
    Function
  ] = useState({});
  const dispatch = useDispatch();
  const { address } = useParams();
  const addressPubkey = address || wallet?.adapter.publicKey?.toBase58();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    async function getAssets() {
      setLoadingMessage("Loading proposals ...");
      try {
        proposalFilters.creator = isMyProposal ? addressPubkey : "";
        proposalFilters.involve = isInvolved ? addressPubkey : "";
        proposalFilters.involve = isPublic
          ? SystemProgram.programId.toBase58()
          : proposalFilters.involve;
        const payload = await dispatch(
          listProposalsThunk({
            endpoint: connection.rpcEndpoint,
            options: proposalFilters,
          } as any) as any
        ).unwrap();
        setProposalList(payload);
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getAssets();
  }, [addressPubkey, proposalFilters]);
  return (
    <>
      {proposals.length ? (
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
          <Paper>
            <TableContainer>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left"># of txs</TableCell>
                    <TableCell align="left"># of approvals</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Expiration</TableCell>
                    <TableCell align="left">Created at</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proposals
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((proposal: any, index: number) => {
                      return <ProposalRow key={index} proposal={proposal} />;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={proposals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Rows per page"
            SelectProps={{
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Stack>
      ) : (
        <Typography textAlign="center" variant="h6" color="info">
          There is no proposal
        </Typography>
      )}
    </>
  );
}
