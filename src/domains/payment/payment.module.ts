import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentDistributionController } from './controllers/payment-distribution.controller';
import { PaymentDistribution } from './entities/payment-distribution.entity';
import { WalletAddress } from './entities/wallet-address.entity';
import { Web3Event } from './entities/web3-event.entity';
import { PaymentDistributionRepository } from './repositories/payment-distribution.repository';
import { WalletAddressRepository } from './repositories/wallet-address.repository';
import { Web3EventRepository } from './repositories/web3-event.repository';
import { PaymentService } from './services/payment.service';
import { WalletService } from './services/wallet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentDistribution, WalletAddress, Web3Event]),
  ],
  providers: [
    PaymentService,
    WalletService,
    PaymentDistributionRepository,
    WalletAddressRepository,
    Web3EventRepository,
  ],
  controllers: [PaymentDistributionController],
  exports: [PaymentService, WalletService],
})
export class PaymentModule {}
