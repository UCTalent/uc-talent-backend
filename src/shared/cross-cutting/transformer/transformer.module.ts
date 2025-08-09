import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TransformerInterceptor } from './transformer.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformerInterceptor,
    },
  ],
})
export class TransformerModule {}
