# Payment Domain

## Overview

The Payment domain handles payment distributions, wallet addresses, and blockchain events for the UC Talent platform.

## Entities

### PaymentDistribution

- Manages payment distributions for jobs
- Tracks amounts, recipients, roles, and status
- Supports different payment types (referral_success, apply_success, close_no_hiring)

### WalletAddress

- Stores wallet addresses for users
- Supports multiple blockchain chains
- Links to user accounts

### Web3Event

- Tracks blockchain events related to jobs
- Stores event data in JSONB format

## Endpoints

### Claim Payment

- **POST** `/api/v1/payment-distributions/claim`
- Requires JWT authentication
- Claims a payment distribution for a user

### Update Blockchain Status

- **PATCH** `/api/v1/payment-distributions/update_blockchain_status`
- Updates payment distribution with blockchain transaction details

### Get Payment Distribution

- **GET** `/api/v1/payment-distributions/:id`
- Retrieves a payment distribution by ID

### Get Payment Distributions by Recipient

- **GET** `/api/v1/payment-distributions/recipient/:recipientId`
- Retrieves all payment distributions for a recipient

### Mark as Paid

- **PUT** `/api/v1/payment-distributions/:id/mark-paid`
- Marks a payment distribution as paid

## DTOs

### ClaimPaymentDto

```typescript
{
  payment_distributions: {
    job_id: string;
    payment_distribution_id: string;
  }
}
```

### UpdateBlockchainStatusDto

```typescript
{
  payment_distribution_id: string;
  status: 'pending' | 'failed' | 'completed';
  transaction_hash: string;
}
```

## Services

### PaymentService

- Handles payment distribution logic
- Validates claim eligibility
- Updates blockchain status

### WalletService

- Manages wallet addresses
- Handles wallet operations

## Repositories

### PaymentDistributionRepository

- CRUD operations for payment distributions
- Custom queries for claimable payments

### WalletAddressRepository

- CRUD operations for wallet addresses
- Queries by owner

### Web3EventRepository

- CRUD operations for web3 events
- Queries by job

## Usage Examples

### Claim a Payment

```typescript
const claimDto = {
  payment_distributions: {
    job_id: 'job-uuid',
    payment_distribution_id: 'dist-uuid',
  },
};

const result = await paymentService.claimPayment(claimDto, userId);
```

### Update Blockchain Status

```typescript
const updateDto = {
  payment_distribution_id: 'dist-uuid',
  status: 'completed',
  transaction_hash: '0xabc123...',
};

const result = await paymentService.updateBlockchainStatus(updateDto);
```

## Testing

Run the tests with:

```bash
npm test src/domains/payment/controllers/payment-distribution.controller.spec.ts
```

## Database Migrations

The payment domain requires the following database tables:

- `payment_distributions`
- `wallet_addresses`
- `web3_events`

Migration files should be created according to the entity specifications in the documentation.
