import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-requests.schemas';
import { SupportRequestsEmployeeService } from './support-request-employee.service';
import { SupportRequestsClientService } from './support-request-client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
  ],
  providers: [
    SupportRequestsService,
    SupportRequestsEmployeeService,
    SupportRequestsClientService,
  ],
  exports: [
    SupportRequestsService,
    SupportRequestsEmployeeService,
    SupportRequestsClientService,
  ],
})
export class SupportRequestsModule {}
