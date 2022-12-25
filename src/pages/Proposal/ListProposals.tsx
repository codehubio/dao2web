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
import ListMyProposal from "../../components/Proposal/ProposalList";
import { TListProposalFilter } from "../../services/state/proposal";
import ProposalListFilters from "../../components/ProposalFilters";

export default function ListProposals() {
  return (
    <>
      <ListMyProposal />
    </>
  );
}
