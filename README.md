# TokenFlow - a simple yet flexible contract for token flow

Demo: https://multisig.codehub.io/
RPC: https://api.devnet.solana.com

## I. Problems

**(P1)** User A creates an proposal among multiple parties where

- user B sends 10 tokens X to user C
- user C sends 2 Sols to user B
- user D sends 100 token Y to user A

All transactions must be agreed upon by its sender in order for the agreement to be approved and executed. If one transaction is rejected by its sender, the agreement will fail

**(P2)** User A seeks fundings for his project by creating a proposal

- 1000 tokens X in Q1
- 200 Sols in Q2
- 300 tokens Y in Q3

Funds may come from different parties. All funding inquiries must be satisfied before 2023/01/01. Otherwise, the proposal will fail.

## II. How TokenFlow solves them

**(S1)** TokenFlow defines a multi-on-demand-transaction proposal and involves all the senders into the signing process.

Funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved by its senders), the locked funds will be released to the receivers accordingly.

**(S2)** TokenFlow defines a multi-on-demand-anonymous-transaction funding proposal. Anyone can involve into the funding process. Similar to **(S1)**, funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved), the locked funds will be released to the receivers accordingly.

## III. Proposal and transaction

Proposal is an agreement defines 1 or many transactions moving funds among parties

## IV. Transaction type

There are 2 transaction types

- **(T1)** Transactions of which sender is 1111111111111111111111111111111.
- **(T2)** Transactions of which sender is **not** 1111111111111111111111111111111.

## V. Transaction approval

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction can be approved by anyone
  - Only sender of which address matches can approve a **(T2)** transaction.

- Approval to a transaction means senders fulfilling the fund desired in that transaction.

- A transaction can be funded many times by senders **until** its fund is fulfilled

- Transaction is approved right after its fund is fulfilled.

## VI. Transaction execution

- Condition

  - The proposal which it belongs to is approved which means all transactions of the proposal are approved

- Executing a tx means sending the previously locked fund during transaction approva to the receiver
- Everyone can execute a transaction and be rewarded

## VII. Transaction rejection

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction cannot be rejected
  - Only sender of which address matches can reject a **(T2)** transaction.

## VIII. Transaction revert

Revert of a transaction means reverting all of its approvals.

- Condition:

  - The proposal that transacion belongs to is rejected.
  - The transaction is approved or partly approved before

- Reverting a tx means sending the previously locked fund during transaction approval back to the sender
- Everyone can revert a transaction and be rewarded

## IX. Phase of a proposal

- _pending_: Proposal is pending right after its creation which allows creator to add the transaction (step) into it

- _settled_: After done adding the transactions, creator can settle the proposal. After that, the proposal would be locked from adding more transactions into it.

- _approved_: Proposal is approved if all of its transactions are approved

- _rejected_: Proposal is rejected if at least 1 of its transactions is rejected

- _expire_: Proposal reaches its end of life after the timestamp defined at _expire_or_finalize_after_ field without being _approved_ or _rejected_

## X. Incentive rate and incentive fee

- Incentive fee is transaction-based and is calculated as follow

  `incentive_fee  = incentive_rate * amount / 10000`

- The fee applies in 2 cases

  - Execution of an approved transaction

  - Revert of an approved transaction

- Since the above actions can be run by _anyone_, a small fee will be credited to the caller. The fee is paid by the parties who approve the transaction.
