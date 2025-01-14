import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Dictionary,
} from '@ton/core';

export type EscrowConfig = {
  feePercentage: number;
  dealDuration: number;
  arbitratorAddresses: Address[];
  sellerAddress: Address;
  buyerAddress: Address;
};

export class EscrowContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromConfig(config: EscrowConfig, code: Cell, workchain = 0) {
    const arbitratorDict = Dictionary.empty(
      Dictionary.Keys.Uint(256),
      Dictionary.Values.Address(),
    );
    config.arbitratorAddresses.forEach((addr, index) => {
      arbitratorDict.set(index, addr);
    });

    const data = beginCell()
      .storeUint(0, 64) // initial amount is 0
      .storeUint(config.feePercentage, 32)
      .storeUint(Math.floor(Date.now() / 1000) + config.dealDuration, 32)
      .storeUint(0, 32) // initial work_submission_time is 0
      .storeUint(0, 8) // initial state is 0 (not funded)
      .storeRef(
        beginCell()
          .storeDict(arbitratorDict)
          .storeAddress(config.sellerAddress)
          .storeAddress(config.buyerAddress)
          .endCell(),
      )
      .endCell();

    const init = { code, data };
    return new EscrowContract(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendFundEscrow(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // OP_FUND_ESCROW
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendCompleteWork(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(2, 32) // OP_COMPLETE_WORK
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendBuyerApprove(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(3, 32) // OP_BUYER_APPROVE
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendBuyerDispute(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(4, 32) // OP_BUYER_DISPUTE
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendArbitratorDecision(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
      sellerPercentage: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(5, 32) // OP_ARBITRATOR_DECISION
        .storeUint(opts.queryID ?? 0, 64)
        .storeUint(opts.sellerPercentage, 16)
        .endCell(),
    });
  }

  async sendClaimFees(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(6, 32) // OP_CLAIM_FEES
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendReleaseEscrow(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(7, 32) // OP_RELEASE_ESCROW
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async getEscrowInfo(provider: ContractProvider) {
    const result = await provider.get('get_escrow_info', []);
    const arbitratorDict = Dictionary.loadDirect(
      Dictionary.Keys.Uint(256),
      Dictionary.Values.Address(),
      result.stack.readCell(),
    );
    return {
      amount: result.stack.readBigNumber(),
      feePercentage: result.stack.readNumber(),
      dealExpirationTime: result.stack.readNumber(),
      workSubmissionTime: result.stack.readNumber(),
      state: result.stack.readNumber(),
      arbitratorAddresses: arbitratorDict,
      sellerAddress: result.stack.readAddress(),
      buyerAddress: result.stack.readAddress(),
    };
  }

  async getEscrowState(provider: ContractProvider) {
    const result = await provider.get('get_escrow_state', []);
    return result.stack.readNumber();
  }
}
