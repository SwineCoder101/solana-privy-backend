import { web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import type { HorseRace } from '../../target/types/horse_race';
export { HorseRace };
export declare function convertToVersionedTransaction(connection: Connection, transaction: Transaction): Promise<VersionedTransaction>;
export declare function convertTxsToVersionedTxs(connection: Connection, txs: Transaction[]): Promise<VersionedTransaction[]>;
export declare function combineTxs(txs: Transaction[]): Promise<Transaction>;
export declare function combineAndConvertTxs(connection: Connection, txs: Transaction[]): Promise<VersionedTransaction>;
export declare function getVersionTxFromInstructions(connection: Connection, instructions: TransactionInstruction[], feePayer?: PublicKey, addressLookupTableAccounts?: web3.AddressLookupTableAccount[]): Promise<VersionedTransaction>;
