import { Document } from '@documents/interface';
import { ClaimPaymentDto } from '@payment/dtos/claim-payment.dto';
import { UpdateBlockchainStatusDto } from '@payment/dtos/update-blockchain-status.dto';
import {
  PaymentDistributionResponseDto,
  PaymentDistributionListResponseDto,
} from '@payment/dtos/payment-response.dto';

const getPaymentDistributionById: Document = {
  operation: { summary: 'Get payment distribution by ID' },
  param: {
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment distribution found successfully',
        type: PaymentDistributionResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Payment distribution not found' }],
  },
} as const;

const getByRecipient: Document = {
  operation: { summary: 'Get payment distributions by recipient ID' },
  param: {
    name: 'recipientId',
    description: 'Recipient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment distributions found successfully',
        type: PaymentDistributionListResponseDto,
      },
    ],
  },
} as const;

const claimPaymentById: Document = {
  operation: { summary: 'Claim payment distribution' },
  param: {
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment claimed successfully',
        type: PaymentDistributionResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Payment distribution not found' }],
  },
} as const;

const markAsPaid: Document = {
  operation: { summary: 'Mark payment distribution as paid' },
  param: {
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment marked as paid successfully',
        type: PaymentDistributionResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Payment distribution not found' }],
  },
} as const;

const claimPayment: Document = {
  operation: { summary: 'Claim payment' },
  body: { type: ClaimPaymentDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment claimed successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                claimed_at: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    ],
    error: [{ status: 422, description: 'Failed to claim payment' }],
  },
} as const;

const updateBlockchainStatus: Document = {
  operation: { summary: 'Update blockchain status' },
  body: { type: UpdateBlockchainStatusDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Blockchain status updated successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                transaction_hash: { type: 'string' },
              },
            },
          },
        },
      },
    ],
    error: [
      { status: 404, description: 'Payment distribution not found' },
      { status: 422, description: 'Invalid status' },
    ],
  },
} as const;

export const Docs = {
  getPaymentDistributionById,
  getByRecipient,
  claimPaymentById,
  markAsPaid,
  claimPayment,
  updateBlockchainStatus,
};
