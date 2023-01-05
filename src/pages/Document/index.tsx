/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import AppContext from "../../share/context";

export default function DocumentationPage() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal List";
    setBreads(["Documentation"]);
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", maxWidth: "60%" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          I. What is Proposol?
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          Proposol is multi-transaction flow management plaform for SPL and
          native tokens on Solana blockchain. By defining on-chain proposals
          which involve all signers into the approval process, we provide
          secure, simple yet flexible solutions to transfer SPL and native
          tokens among parties.
        </Typography>
        <br />
        <Typography variant="subtitle1" fontWeight="bold">
          II. Problems
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          a) User A request a multi-transaction scenario among parties where:
          <ul>
            <li>User B sends 10 tokens X to user C</li>
            <li>User C sends 2 SOLs to user B</li>
            <li>user D sends 100 token Y to user A</li>
          </ul>
        </Typography>
        <Typography variant="subtitle2" fontWeight="light">
          b) User A calls fund-raising for his project where he needs a certain
          amount of fund from <i>anonymous sponsors</i>
          <ul>
            <li>100 tokens X</li>
            <li>10 SOLs</li>
            <li>200 tokens Y</li>
          </ul>
        </Typography>
        <Typography variant="subtitle2" fontWeight="light" fontStyle="italic">
          Constraint: The call must be completely fulfilled before certain
          deadline otherwise it would be considered failed.
        </Typography>
        <br />
        <Typography variant="subtitle1" fontWeight="bold">
          III. How Proposol solves them
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          a) Proposol defines a multi-on-demand-transaction proposal and
          involves all the senders into the signing process. Funds from approved
          transactions are safely moved to a vault and locked. Only after all
          transactions are approved by their senders, the proposl is consider
          approved and the locked funds will be released to the receivers
          accordingly.
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          If any of the proposed transactions is rejected by the expected
          transactions, the proposal is consider failed and the locked funds can
          be reverted back to their according senders.
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          b) Proposol defines a multi-on-demand-anonymous-transaction funding
          proposal. Anyone can involve into the funding process by sending a
          portion of (or full) the requested amount. Funds from approved
          transactions are safely moved to a vault and locked. Only after all
          transactions are approved, the proposl is consider approved and the
          locked funds will be released to the receivers accordingly.
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light" fontStyle="italic">
          Note: Anonymous transactions cannot be rejected. The proposal wil be
          considered failed if it does not reach finalization after a certain
          deadline. In this case, the locked funds can be reverted back to their
          according senders.
        </Typography>
        <br />
        <Typography variant="subtitle1" fontWeight="bold">
          III. Terminology
        </Typography>
        <br />
        <Typography variant="subtitle2">1. Proposal</Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          A proposal is an agreement defines one or many transactions moving
          funds among parties.
        </Typography>
        <br />
        <Typography variant="subtitle2">2. Transaction</Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="light">
          A transaction defines a flow of fund between two parties. There are
          two types of transactions
          <ul>
            <li>
              <b>T1:</b> A transaction of which sender is <b>not</b>{" "}
              11111111111111111111111111111111
              <ul>
                <li>
                  Can only be approved/partly approved/rejected by the sender of
                  which address matches.
                </li>
              </ul>
            </li>
            <br />
            <li>
              <b>T2:</b> An <b>anonymous</b> transaction of which sender is{" "}
              11111111111111111111111111111111
              <ul>
                <li>
                  Can be approved/partly approved by <i>anyone</i>.
                </li>
                <li>Cannot be rejected.</li>
              </ul>
            </li>
          </ul>
        </Typography>
        <br />
        <Typography variant="subtitle2">3. Proposal phases</Typography>
        <Typography variant="subtitle2" fontWeight="light">
          <ul>
            <li>
              <i>
                <b>pending</b>
              </i>
              : Proposal is pending right after being created which allows its
              creator to add more transactions into.
            </li>
            <li>
              <i>
                <b>settled</b>
              </i>
              : After done adding transactions, creator can settle the proposal.
              After that, the proposal would be locked from adding more
              transactions into.
            </li>
            <li>
              <i>
                <b>approved</b>
              </i>
              : Proposal is automatically approved if all of its transactions
              are approved
            </li>
            <li>
              <i>
                <b>rejected</b>
              </i>
              : Proposal is automatically rejected if at least one of its
              transactions is rejected.
            </li>
            <li>
              <i>
                <b>expired</b>
              </i>
              : After a certain deadline without the proposal being approved or
              rejected, it will be automatically expired. This phase is final
            </li>
            <li>
              <i>
                <b>executed</b>
              </i>
              : After the proposal is approved, its transactions can be{" "}
              <i>executed</i> which means funds are released to the receivers.
              After all of its transactions are executed, the proposal is marked
              as <i>executed.</i>. This phase is final
            </li>
          </ul>
        </Typography>
        <Typography variant="subtitle2">4. Transaction phases</Typography>
        <Typography variant="subtitle2" fontWeight="light">
          <ul>
            <li>
              <i>
                <b>partly approved/approved: </b>
              </i>
              Transaction can be fully approved - requested funds are fully sent
              - or partly approved - only a portion of requested funds are sent.
              A transaction can be partly approved many times until it is
              approved.
              <ul>
                <li>
                  The proposal which the transaction belongs to is{" "}
                  <b>settled</b>, not yet{" "}
                  <b>rejected or approved or executed</b>.
                </li>
                <li>
                  <b>T1</b> transactions can only be partly
                  approved/approved/rejected by the senders of which addresses
                  match.
                </li>
                <li>
                  <b>T2</b> transactions can be approved by anyone.
                </li>
                <li>
                  The transaction is not fully approved or rejected (for T1
                  transaction).
                </li>
              </ul>
              <i>
                After approved, the fund will be transfer from sender's wallet
                to the vault
              </i>
              <li>
                <i>
                  <b>rejected: </b>
                </i>
                <ul>
                  <li>
                    Only <b>T1</b> transaction can be rejected by its sender.
                  </li>
                  <li>
                    The transaction is not fully approved or rejected (for T1
                    transaction).
                  </li>
                </ul>
              </li>
              <li>
                <i>
                  <b>executed:</b>
                </i>
                <ul>
                  <li>
                    The proposal which the transaction belongs to is{" "}
                    <b>approved</b>.
                  </li>
                  <li>
                    The transaction is not yet <b>executed</b>.
                  </li>
                  <li>
                    Can be executed by <b>anyone</b>. The caller will be
                    rewarded with <b>incentive fee</b>
                  </li>
                </ul>
                <i>
                  After execution, the locked fund will be released from the
                  vault to the receiver
                </i>
              </li>
              <li>
                <i>
                  <b>reverted:</b>
                </i>
                <ul>
                  <li>
                    The proposal which the transaction belongs to is{" "}
                    <b>rejected</b>.
                  </li>
                  <li>
                    The transaction is <b>approved or partly approved</b>.
                  </li>
                  <li>
                    Can be reverted by <b>anyone</b>. The caller will be
                    rewarded with <b>incentive fee</b>
                  </li>
                </ul>
                <i>
                  After revert, the locked fund will be sent back from the vault
                  to the sender
                </i>
              </li>
            </li>
          </ul>
        </Typography>
        <Typography variant="subtitle2">
          5. Inventive rate and incentive fee
        </Typography>
        <Typography variant="subtitle2" fontWeight="light">
          <ul>
            <li>
              Incentive rate defaults to 0 and is transaction-based, set by
              proposal creator
            </li>
            <li>
              Incentive fee is used to calculate the incentive rate which is
              paid by the <b>senders</b> who approve the transactions based on
              the approved amounts.
            </li>
            <li>
              Incentive fee is credited to the <b>caller</b> who
              executes/reverts the transaction after the proposal it belongs to
              is approved/rejected.
            </li>
          </ul>
        </Typography>
      </div>
    </div>
  );
}
