import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDistribution } from './entities/payment-distribution.entity';
import { WalletAddress } from './entities/wallet-address.entity';
import { PaymentService } from './services/payment.service';
import { WalletService } from './services/wallet.service';
import { PaymentDistributionController } from './controllers/payment-distribution.controller';
import { PaymentDistributionRepository } from './repositories/payment-distribution.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDistribution, WalletAddress])],
  providers: [
    PaymentService,
    WalletService,
    PaymentDistributionRepository,
  ],
  controllers: [PaymentDistributionController],
  exports: [PaymentService, WalletService],
})
export class PaymentModule {} 