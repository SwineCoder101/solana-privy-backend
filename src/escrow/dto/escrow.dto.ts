import { IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployEscrowDto {
  @ApiProperty({
    description: 'Array of arbitrator addresses',
    example: ['EQA...', 'EQB...'],
  })
  @IsArray()
  @IsString({ each: true })
  arbitratorAddresses: string[];

  @ApiProperty({
    description: 'Address of the seller',
    example: 'EQC...',
  })
  @IsString()
  sellerAddress: string;

  @ApiProperty({
    description: 'Address of the buyer',
    example: 'EQD...',
  })
  @IsString()
  buyerAddress: string;

  @ApiProperty({
    description: 'Fee percentage for the escrow service',
    minimum: 0,
    maximum: 100,
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  feePercentage: number;

  @ApiProperty({
    description: 'Duration of the deal in seconds',
    minimum: 0,
    example: 604800, // 7 days
  })
  @IsNumber()
  @Min(0)
  dealDuration: number;

  @ApiProperty({
    description: 'ID of the associated offer',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  offerId: number;
}

export class FundEscrowDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;

  @ApiProperty({
    description: 'Amount to fund the escrow (in TON)',
    example: '10.5',
  })
  @IsString()
  amount: string;
}

export class CompleteWorkDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}

export class BuyerApproveDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}

export class BuyerDisputeDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}

export class ArbitratorDecisionDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;

  @ApiProperty({
    description: 'Percentage of funds to be given to the seller',
    minimum: 0,
    maximum: 100,
    example: 75,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  sellerPercentage: number;
}

export class ClaimFeesDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}

export class ReleaseEscrowDto {
  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}

export class BroadcastMessageDto {
  @ApiProperty({
    description: 'Base64-encoded signed message',
    example:
      'te6ccgEBAQEAWAAAq2n+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE/zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzSsG8DgAAAAAjuOu9NAL7BxYpA',
  })
  @IsString()
  signedMessage: string;

  @ApiProperty({
    description: 'Address of the escrow contract',
    example: 'EQE...',
  })
  @IsString()
  contractAddress: string;
}
