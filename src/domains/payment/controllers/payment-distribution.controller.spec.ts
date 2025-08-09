import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import type { ClaimPaymentDto } from '../dtos/claim-payment.dto';
import type { UpdateBlockchainStatusDto } from '../dtos/update-blockchain-status.dto';
import { PaymentService } from '../services/payment.service';

import { PaymentDistributionController } from './payment-distribution.controller';

describe('PaymentDistributionController', () => {
  let controller: PaymentDistributionController;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentDistributionController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            findPaymentDistributionById: jest.fn(),
            findPaymentDistributionsByRecipient: jest.fn(),
            claimPayment: jest.fn(),
            updateBlockchainStatus: jest.fn(),
            markAsPaid: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentDistributionController>(
      PaymentDistributionController
    );
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('claimPayment', () => {
    it('should claim payment successfully', async () => {
      const claimDto: ClaimPaymentDto = {
        payment_distributions: {
          job_id: 'job-uuid',
          payment_distribution_id: 'dist-uuid',
        },
      };
      const user = { id: 'user-uuid' };
      const expectedResult = {
        success: true,
        data: {
          id: 'dist-uuid',
          status: 'completed',
          claimed_at: new Date(),
        },
      };

      jest.spyOn(service, 'claimPayment').mockResolvedValue(expectedResult);

      const result = await controller.claimPayment(claimDto, user);

      expect(result).toBe(expectedResult);
      expect(service.claimPayment).toHaveBeenCalledWith(claimDto, user.id);
    });
  });

  describe('updateBlockchainStatus', () => {
    it('should update blockchain status successfully', async () => {
      const updateDto: UpdateBlockchainStatusDto = {
        payment_distribution_id: 'dist-uuid',
        status: 'completed',
        transaction_hash: '0xabc123...',
      };
      const expectedResult = {
        success: true,
        data: {
          id: 'dist-uuid',
          status: 'completed',
          transaction_hash: '0xabc123...',
        },
      };

      jest
        .spyOn(service, 'updateBlockchainStatus')
        .mockResolvedValue(expectedResult);

      const result = await controller.updateBlockchainStatus(updateDto);

      expect(result).toBe(expectedResult);
      expect(service.updateBlockchainStatus).toHaveBeenCalledWith(updateDto);
    });
  });
});
