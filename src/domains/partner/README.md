# Partner Domain

## Overview

The Partner domain manages partner organizations, their host configurations, and associated blockchain networks for the UC Talent platform.

## Architecture

### Entities

1. **Partner**: Main partner organization entity
   - Properties: name, slug, isUcTalent
   - Relations: One-to-many with PartnerHost

2. **PartnerHost**: Host configuration for partners
   - Properties: host, slug, accessToken, isUcTalent, partnerId
   - Relations: Many-to-one with Partner, One-to-many with PartnerHostNetwork and Job

3. **PartnerHostNetwork**: Blockchain network configuration for hosts
   - Properties: network (enum), default, partnerHostId
   - Relations: Many-to-one with PartnerHost

### Controllers

1. **PartnerController** (`/api/v1/partners`)
   - GET `/` - List partners with pagination and filtering
   - GET `/:id` - Get partner details
   - POST `/` - Create new partner
   - PUT `/:id` - Update partner
   - DELETE `/:id` - Delete partner (soft delete)
   - GET `/:id/stats` - Get partner statistics

2. **PartnerHostController** (`/api/v1/partner-hosts`)
   - GET `/` - List partner hosts with pagination and filtering
   - GET `/:id` - Get partner host details
   - POST `/` - Create new partner host
   - PUT `/:id` - Update partner host
   - POST `/:id/regenerate-token` - Regenerate access token
   - GET `/:hostId/networks` - Get host networks
   - POST `/:hostId/networks` - Add network to host
   - PATCH `/:hostId/networks/:networkId` - Update network settings

3. **PartnerAuthController** (`/api/v1/partner-auth`)
   - POST `/validate` - Validate partner token and host

### Services

**PartnerService** provides comprehensive business logic for:
- Partner CRUD operations
- Partner host management
- Network configuration
- Authentication validation
- Statistics calculation

### DTOs

- **CreatePartnerDto**: For creating new partners
- **UpdatePartnerDto**: For updating partner information
- **CreatePartnerHostDto**: For creating new partner hosts with optional networks
- **UpdatePartnerHostDto**: For updating partner host information
- **PartnerQueryDto**: For filtering and pagination of partners
- **PartnerHostQueryDto**: For filtering and pagination of partner hosts
- **CreatePartnerNetworkDto**: For adding networks to hosts
- **UpdatePartnerNetworkDto**: For updating network settings
- **PartnerResponseDto**: Response format for partner data
- **PartnerHostResponseDto**: Response format for partner host data

### Authentication

**Partner Token Authentication**:
- Uses `X-Partner-Token` and `X-Partner-Host` headers
- `PartnerTokenGuard` validates token and host combination
- `@Partner` and `@PartnerHost` decorators provide access to authenticated partner data

### Network Types

Supported blockchain networks:
- `ethereum` - Ethereum mainnet
- `base` - Base network
- `bnb` - BNB Smart Chain
- `coti_v2` - COTI v2 network

## API Examples

### Create Partner
```bash
POST /api/v1/partners
{
  "name": "Tech Solutions Inc",
  "slug": "tech-solutions",
  "isUcTalent": false
}
```

### Create Partner Host with Networks
```bash
POST /api/v1/partner-hosts
{
  "host": "api.techsolutions.com",
  "slug": "tech-solutions-api",
  "partnerId": "uuid-partner-id",
  "isUcTalent": false,
  "networks": [
    {
      "network": "ethereum",
      "default": true
    },
    {
      "network": "base",
      "default": false
    }
  ]
}
```

### Validate Partner Token
```bash
POST /api/v1/partner-auth/validate
Headers:
  X-Partner-Token: generated-access-token
  X-Partner-Host: api.techsolutions.com
```

## Features

- ✅ Complete CRUD operations for partners and hosts
- ✅ Network management for blockchain integration
- ✅ Token-based authentication for partners
- ✅ Pagination and filtering support
- ✅ Input validation and error handling
- ✅ Swagger API documentation
- ✅ TypeORM entities with proper relationships
- ✅ Repository pattern implementation
- ✅ Comprehensive service layer

## Security

- Partner access tokens are generated using cryptographically secure random bytes
- Host and token validation prevents unauthorized access
- Unique constraints on slugs and access tokens
- Soft delete for data integrity

## Database Relations

```
Partner (1) ----< PartnerHost (1) ----< PartnerHostNetwork
                       |
                       +----< Job
```

## Next Steps

1. Add comprehensive unit tests
2. Add integration tests
3. Implement statistics calculation methods
4. Add audit logging
5. Add rate limiting for partner endpoints
6. Implement webhook notifications for partner events