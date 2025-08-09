# Payment Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic liên quan đến domain Payment trong hệ thống UC Talent.

## 🏗️ Payment Domain Architecture

### Core Entities

- **PaymentDistribution**: Phân phối và claim tiền thưởng/referral
- **WalletAddress**: Địa chỉ ví nhận tiền
- **Web3Event**: Sự kiện blockchain liên quan đến payment

### Supporting Entities

- **User**: Người nhận
- **Job**: Công việc liên quan

---

## 💸 Payment Distribution & Claim

### 1. Claim Payment

#### Endpoint: `POST /api/v1/payment_distributions/claim`

#### Request Body

```json
{
  "payment_distributions": {
    "job_id": "job-uuid",
    "payment_distribution_id": "payment-dist-uuid"
  }
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "payment-dist-uuid",
    "status": "completed",
    "claimed_at": "2024-01-20T10:00:00Z"
  }
}
```

#### Response Error (422)

```json
{
  "success": false,
  "errors": ["Failed to claim payment"]
}
```

#### NestJS Implementation

```typescript
// payment-distribution.controller.ts
@Post('claim')
@UseGuards(JwtAuthGuard)
async claimPayment(@Body() claimDto: ClaimPaymentDto, @CurrentUser() user: User) {
  return this.paymentService.claimPayment(claimDto, user.id);
}

// payment.service.ts
async claimPayment(claimDto: ClaimPaymentDto, userId: string) {
  // 1. Validate params
  if (!claimDto.job_id) throw new BadRequestException('job_id is required');

  // 2. Find job
  const job = await this.jobRepository.findOne({ where: { id: claimDto.job_id } });
  if (!job) throw new NotFoundException('Job not found');

  // 3. Find claimable payment distribution
  const paymentDist = await this.paymentDistributionRepository.findOne({
    where: {
      id: claimDto.payment_distribution_id,
      jobId: claimDto.job_id,
      recipientId: userId,
      status: 'pending',
      role: Not('platform_fee')
    }
  });
  if (!paymentDist) throw new NotFoundException('Payment distribution not found or not claimable');

  // 4. Validate role claim logic (candidate, referrer, hiring_manager)
  if (!this.validateRoleClaim(paymentDist, userId)) {
    throw new BadRequestException('Role not eligible to claim');
  }

  // 5. Update status
  paymentDist.status = 'completed';
  paymentDist.claimedAt = new Date();
  await this.paymentDistributionRepository.save(paymentDist);

  return {
    success: true,
    data: {
      id: paymentDist.id,
      status: paymentDist.status,
      claimed_at: paymentDist.claimedAt
    }
  };
}

private validateRoleClaim(paymentDist: PaymentDistribution, userId: string): boolean {
  // Implement logic tương tự như Rails: kiểm tra job status, job_apply status, v.v.
  // ...
  return true;
}
```

### 2. Update Blockchain Status

#### Endpoint: `PATCH /api/v1/payment_distributions/update_blockchain_status`

#### Request Body

```json
{
  "payment_distribution_id": "payment-dist-uuid",
  "status": "completed",
  "transaction_hash": "0xabc123..."
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "payment-dist-uuid",
    "status": "completed",
    "transaction_hash": "0xabc123..."
  }
}
```

#### Response Error (404/422)

```json
{
  "success": false,
  "errors": ["Payment distribution not found"]
}
```

#### NestJS Implementation

```typescript
// payment-distribution.controller.ts
@Patch('update_blockchain_status')
async updateBlockchainStatus(@Body() updateDto: UpdateBlockchainStatusDto) {
  return this.paymentService.updateBlockchainStatus(updateDto);
}

// payment.service.ts
async updateBlockchainStatus(updateDto: UpdateBlockchainStatusDto) {
  const paymentDist = await this.paymentDistributionRepository.findOne({
    where: { id: updateDto.payment_distribution_id }
  });
  if (!paymentDist) throw new NotFoundException('Payment distribution not found');

  if (updateDto.status !== 'completed') {
    throw new BadRequestException('Invalid status');
  }

  paymentDist.status = 'completed';
  paymentDist.transactionHash = updateDto.transaction_hash;
  await this.paymentDistributionRepository.save(paymentDist);

  return {
    success: true,
    data: {
      id: paymentDist.id,
      status: paymentDist.status,
      transaction_hash: paymentDist.transactionHash
    }
  };
}
```

---

## 🏦 Payment Distribution Management

### 1. Entity: PaymentDistribution

- **id**: string (PK)
- **amount_cents**: bigint
- **amount_currency**: string (default: USDT)
- **claimed_at**: datetime
- **notes**: text
- **payment_type**: string (referral_success, apply_success, close_no_hiring)
- **percentage**: decimal
- **recipient_type**: string (User, Talent, ...)
- **recipient_id**: string
- **role**: string (candidate, referrer, hiring_manager, platform_fee)
- **status**: string (pending, failed, completed)
- **job_id**: string (FK)
- **created_at, updated_at**: datetime

### 2. Entity: WalletAddress

- **id**: string (PK)
- **address**: string
- **chain_name**: string
- **owner_id**: string (FK to User)
- **created_at, updated_at**: datetime

### 3. Entity: Web3Event

- **id**: string (PK)
- **event_type**: string
- **job_id**: string (FK)
- **data**: jsonb
- **created_at, updated_at**: datetime

---

## 📝 DTOs

### 1. Claim Payment DTO

```typescript
// claim-payment.dto.ts
export class ClaimPaymentDto {
  @IsUUID()
  job_id: string;

  @IsUUID()
  payment_distribution_id: string;
}
```

### 2. Update Blockchain Status DTO

```typescript
// update-blockchain-status.dto.ts
export class UpdateBlockchainStatusDto {
  @IsUUID()
  payment_distribution_id: string;

  @IsString()
  status: string;

  @IsString()
  transaction_hash: string;
}
```

---

## 🔧 Services Implementation

### 1. Payment Service

```typescript
// payment.service.ts
@Injectable()
export class PaymentService {
  constructor(
    private paymentDistributionRepository: PaymentDistributionRepository,
    private jobRepository: JobRepository
  ) {}

  async claimPayment(claimDto: ClaimPaymentDto, userId: string) {
    // Implementation như trên
  }

  async updateBlockchainStatus(updateDto: UpdateBlockchainStatusDto) {
    // Implementation như trên
  }
}
```

---

## 🧪 Testing

### 1. Payment Controller Test

```typescript
// payment-distribution.controller.spec.ts
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
            claimPayment: jest.fn(),
            updateBlockchainStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentDistributionController>(
      PaymentDistributionController
    );
    service = module.get<PaymentService>(PaymentService);
  });

  it('should claim payment', async () => {
    const claimDto = {
      job_id: 'job-uuid',
      payment_distribution_id: 'dist-uuid',
    };
    const user = { id: 'user-uuid' };
    const expectedResult = {
      success: true,
      data: { id: 'dist-uuid', status: 'completed' },
    };

    jest.spyOn(service, 'claimPayment').mockResolvedValue(expectedResult);

    const result = await controller.claimPayment(claimDto, user);

    expect(result).toBe(expectedResult);
    expect(service.claimPayment).toHaveBeenCalledWith(claimDto, user.id);
  });
});
```

---

## 📋 Checklist

- [ ] Claim Payment
- [ ] Update Blockchain Status
- [ ] PaymentDistribution Entity
- [ ] WalletAddress Entity
- [ ] Web3Event Entity
- [ ] DTOs
- [ ] Service Logic
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] API Documentation

---

**🎉 Ready for implementation!**
