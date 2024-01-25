import { Controller } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';

@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}
}
