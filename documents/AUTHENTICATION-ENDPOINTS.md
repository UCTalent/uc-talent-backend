# Authentication Endpoints Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các authentication endpoints từ Rails project và cách implement trong NestJS.

## 🔐 Authentication Types

### 1. Firebase Authentication

### 2. Web3 Authentication (Thirdweb)

### 3. Traditional Email/Password Authentication

### 4. OAuth2 Authentication

### 5. Social Authentication

---

## 🚀 Firebase Authentication

### Endpoint: `POST /api/v1/auth/firebase`

#### Request Body

```json
{
  "firebase_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200)

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "user_id": "uuid-string",
  "token_type": "Bearer",
  "access_token": "oauth_access_token_here",
  "has_profile": true,
  "expires_in": 7200,
  "created_at": 1234567890,
  "refresh_token": "refresh_token_here"
}
```

#### Response Error (401)

```json
{
  "error": "Invalid Firebase token"
}
```

#### NestJS Implementation

```typescript
// auth.controller.ts
@Post('firebase')
async firebaseAuth(@Body() body: { firebase_token: string }) {
  return this.authService.firebaseAuth(body.firebase_token);
}

// auth.service.ts
async firebaseAuth(token: string) {
  // 1. Verify Firebase token
  const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);

  // 2. Get user data from Firebase
  const userRecord = await this.firebaseAdmin.auth().getUser(decodedToken.uid);

  // 3. Find or create user
  const user = await this.findOrCreateUser({
    email: userRecord.email || `${userRecord.displayName}@uctalent.com`,
    firebaseUid: decodedToken.uid,
    name: userRecord.displayName || 'User',
    firebaseProvider: decodedToken.firebase?.sign_in_provider
  });

  // 4. Generate OAuth2 token
  const accessToken = await this.oauthService.createAccessToken(user.id);

  // 5. Check if user has talent profile
  const hasProfile = await this.talentService.hasProfile(user.id);

  return {
    user: {
      name: user.name,
      email: user.email
    },
    user_id: user.id,
    token_type: 'Bearer',
    access_token: accessToken.token,
    has_profile: hasProfile,
    expires_in: accessToken.expiresIn,
    created_at: accessToken.createdAt.getTime(),
    refresh_token: accessToken.refreshToken
  };
}
```

---

## 🌐 Web3 Authentication (Thirdweb)

### Endpoint: `POST /api/v1/auth/web3`

#### Request Body

```json
{
  "jwt_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200)

```json
{
  "access_token": "oauth_access_token_here",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "refresh_token_here",
  "scope": "read write",
  "created_at": 1234567890
}
```

#### Response Error (401)

```json
{
  "error": "Invalid JWT token"
}
```

#### NestJS Implementation

```typescript
// auth.controller.ts
@Post('web3')
async web3Auth(@Body() body: { jwt_token: string }) {
  return this.authService.web3Auth(body.jwt_token);
}

// auth.service.ts
async web3Auth(jwtToken: string) {
  try {
    // 1. Verify JWT token with Thirdweb
    const decodedToken = await this.thirdwebService.verifyToken(jwtToken);

    // 2. Extract user data from JWT
    const userData = {
      address: decodedToken.sub, // wallet address
      email: decodedToken.email,
      name: decodedToken.name
    };

    // 3. Find or create user
    const user = await this.findOrCreateWeb3User(userData);

    // 4. Generate OAuth2 token
    const accessToken = await this.oauthService.createAccessToken(user.id);

    return {
      access_token: accessToken.token,
      token_type: 'Bearer',
      expires_in: accessToken.expiresIn,
      refresh_token: accessToken.refreshToken,
      scope: accessToken.scopes.join(' '),
      created_at: accessToken.createdAt.getTime()
    };
  } catch (error) {
    throw new UnauthorizedException('Invalid JWT token');
  }
}
```

---

## 📧 Traditional Email/Password Authentication

### 1. User Registration

#### Endpoint: `POST /api/v1/auth/register`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "location_city_id": "city-uuid",
  "ref_code": "REF123"
}
```

#### Response Success (201)

```json
{
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "confirmed_at": null
  },
  "message": "Confirmation email sent"
}
```

#### NestJS Implementation

```typescript
// auth.controller.ts
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}

// auth.service.ts
async register(registerDto: RegisterDto) {
  // 1. Validate input
  await this.validateRegistration(registerDto);

  // 2. Create user
  const user = await this.userService.create({
    name: registerDto.name,
    email: registerDto.email,
    password: await this.hashPassword(registerDto.password),
    locationCityId: registerDto.location_city_id,
    refCode: registerDto.ref_code
  });

  // 3. Send confirmation email
  await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      confirmed_at: user.confirmedAt
    },
    message: 'Confirmation email sent'
  };
}
```

### 2. User Login

#### Endpoint: `POST /api/v1/auth/login`

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Response Success (200)

```json
{
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token_type": "Bearer",
  "access_token": "jwt_token_here",
  "expires_in": 7200,
  "has_profile": true
}
```

#### Response Error (401)

```json
{
  "error": "Invalid email or password"
}
```

#### NestJS Implementation

```typescript
// auth.controller.ts
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

// auth.service.ts
async login(loginDto: LoginDto) {
  // 1. Find user by email
  const user = await this.userService.findByEmail(loginDto.email);
  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 2. Verify password
  const isPasswordValid = await this.verifyPassword(loginDto.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 3. Check if user is confirmed
  if (!user.confirmedAt) {
    throw new UnauthorizedException('Please confirm your email first');
  }

  // 4. Generate JWT token
  const token = this.jwtService.sign({
    sub: user.id,
    email: user.email
  });

  // 5. Check if user has talent profile
  const hasProfile = await this.talentService.hasProfile(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token_type: 'Bearer',
    access_token: token,
    expires_in: 7200,
    has_profile: hasProfile
  };
}
```

### 3. Password Reset

#### Endpoint: `POST /api/v1/auth/forgot-password`

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Response Success (200)

```json
{
  "message": "Reset password email sent"
}
```

#### NestJS Implementation

```typescript
// auth.controller.ts
@Post('forgot-password')
async forgotPassword(@Body() body: { email: string }) {
  return this.authService.forgotPassword(body.email);
}

// auth.service.ts
async forgotPassword(email: string) {
  const user = await this.userService.findByEmail(email);
  if (user) {
    // Generate reset token
    const resetToken = this.generateResetToken();
    await this.userService.updateResetToken(user.id, resetToken);

    // Send reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  return { message: 'Reset password email sent' };
}
```

#### Endpoint: `PUT /api/v1/auth/reset-password`

#### Request Body

```json
{
  "token": "reset_token_here",
  "password": "new_password"
}
```

#### Response Success (200)

```json
{
  "message": "Password updated successfully"
}
```

### 4. Email Confirmation

#### Endpoint: `GET /api/v1/auth/confirm-email`

#### Request Query

```
?confirmation_token=token_here
```

#### Response Success (200)

```json
{
  "message": "Email confirmed successfully"
}
```

---

## 🔑 OAuth2 Authentication

### 1. Authorization Endpoint

#### Endpoint: `GET /api/v1/oauth/authorize`

#### Request Query

```
?client_id=client_id&redirect_uri=redirect_uri&response_type=code&scope=read write
```

#### Response Success (200)

```html
<!-- OAuth authorization page -->
```

### 2. Token Endpoint

#### Endpoint: `POST /api/v1/oauth/token`

#### Request Body

```json
{
  "grant_type": "authorization_code",
  "code": "authorization_code",
  "client_id": "client_id",
  "client_secret": "client_secret",
  "redirect_uri": "redirect_uri"
}
```

#### Response Success (200)

```json
{
  "access_token": "token_here",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "refresh_token_here",
  "scope": "read write"
}
```

### 3. Token Info

#### Endpoint: `GET /api/v1/oauth/token/info`

#### Request Headers

```
Authorization: Bearer access_token_here
```

#### Response Success (200)

```json
{
  "resource_owner_id": "user_id",
  "scope": ["read", "write"],
  "expires_in": 3600,
  "application": {
    "uid": "client_id"
  }
}
```

---

## 📱 Social Authentication

### Endpoint: `POST /api/v1/auth/social/callback`

#### Request Body

```json
{
  "provider": "google",
  "uid": "social_user_id",
  "email": "user@example.com",
  "name": "User Name"
}
```

#### Response Success (200)

```json
{
  "user": {
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token_type": "Bearer",
  "access_token": "jwt_token_here",
  "expires_in": 7200
}
```

---

## 🛡️ Security Implementation

### 1. JWT Strategy

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

### 2. JWT Auth Guard

```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
```

### 3. Rate Limiting

```typescript
// auth.controller.ts
@UseGuards(ThrottlerGuard)
@Throttle(5, 60) // 5 requests per minute
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

---

## 📝 DTOs (Data Transfer Objects)

### 1. Register DTO

```typescript
// register.dto.ts
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsUUID()
  location_city_id?: string;

  @IsOptional()
  @IsString()
  ref_code?: string;
}
```

### 2. Login DTO

```typescript
// login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

### 3. Firebase Auth DTO

```typescript
// firebase-auth.dto.ts
export class FirebaseAuthDto {
  @IsString()
  @IsNotEmpty()
  firebase_token: string;
}
```

### 4. Web3 Auth DTO

```typescript
// web3-auth.dto.ts
export class Web3AuthDto {
  @IsString()
  @IsNotEmpty()
  jwt_token: string;
}
```

---

## 🔧 Services Implementation

### 1. Auth Service

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private oauthService: OAuthService,
    private emailService: EmailService,
    private firebaseAdmin: FirebaseAdmin,
    private thirdwebService: ThirdwebService
  ) {}

  async firebaseAuth(token: string) {
    // Implementation
  }

  async web3Auth(jwtToken: string) {
    // Implementation
  }

  async register(registerDto: RegisterDto) {
    // Implementation
  }

  async login(loginDto: LoginDto) {
    // Implementation
  }

  async forgotPassword(email: string) {
    // Implementation
  }

  async resetPassword(token: string, password: string) {
    // Implementation
  }

  async confirmEmail(token: string) {
    // Implementation
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### 2. OAuth Service

```typescript
// oauth.service.ts
@Injectable()
export class OAuthService {
  constructor(
    private accessTokenRepository: Repository<AccessToken>,
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async createAccessToken(userId: string): Promise<AccessToken> {
    const accessToken = this.accessTokenRepository.create({
      userId,
      expiresAt: new Date(Date.now() + 7200 * 1000), // 2 hours
      scopes: ['read', 'write'],
    });

    return this.accessTokenRepository.save(accessToken);
  }

  async validateAccessToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()) },
    });
  }
}
```

---

## 🧪 Testing

### 1. Unit Tests

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should login user with valid credentials', async () => {
    const loginDto = { email: 'test@example.com', password: 'password' };
    const user = { id: '1', email: 'test@example.com', password: 'hashed' };

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);

    const result = await service.login(loginDto);

    expect(result.user.email).toBe('test@example.com');
    expect(result.access_token).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.user.email).toBe('test@example.com');
      });
  });
});
```

---

## 📚 Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# OAuth2 Configuration
OAUTH_APPLICATION_ID=your-oauth-application-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# App Configuration
FRONTEND_URL=http://localhost:3001
API_BASE_URL=http://localhost:3000
```

---

## 🚀 Quick Start

1. **Install Dependencies**

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install firebase-admin @thirdweb-dev/sdk
```

2. **Setup Environment**

```bash
cp .env.example .env
# Update environment variables
```

3. **Implement Controllers & Services**

```bash
# Follow the implementation examples above
```

4. **Test Endpoints**

```bash
npm run test:e2e
```

---

## 📋 Checklist

- [ ] Firebase Authentication
- [ ] Web3 Authentication
- [ ] Email/Password Registration
- [ ] Email/Password Login
- [ ] Password Reset
- [ ] Email Confirmation
- [ ] OAuth2 Implementation
- [ ] Social Authentication
- [ ] JWT Strategy
- [ ] Rate Limiting
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Environment Variables
- [ ] Documentation

---

**🎉 Happy Implementing!**
