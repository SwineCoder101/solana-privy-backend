import { web3 } from "@coral-xyz/anchor";
export declare function getVersionTxFromInstructions(connection: web3.Connection, instructions: web3.TransactionInstruction[], payer: web3.PublicKey): Promise<web3.VersionedTransaction>;
