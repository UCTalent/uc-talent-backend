import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PartnerHostRepository } from '@domains/partner/repositories/partner-host.repository';

@Injectable()
export class PartnerTokenGuard implements CanActivate {
  constructor(private partnerHostRepository: PartnerHostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const host = this.extractHostFromHeader(request);
    
    if (!token || !host) {
      throw new UnauthorizedException('Partner token and host are required');
    }
    
    const partnerHost = await this.partnerHostRepository.findByAccessToken(token);
    
    if (!partnerHost || partnerHost.host !== host) {
      throw new UnauthorizedException('Invalid partner token or host');
    }
    
    request['partnerHost'] = partnerHost;
    request['partner'] = partnerHost.partner;
    
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    return request.headers['x-partner-token'] as string;
  }

  private extractHostFromHeader(request: any): string | undefined {
    return request.headers['x-partner-host'] as string;
  }
}