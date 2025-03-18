// listening-history.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ListeningHistoryService } from './listening-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SourceType } from 'src/schemas/listening-history.schema';

@Controller('history')
export class ListeningHistoryController {
  constructor(private readonly listeningHistoryService: ListeningHistoryService) {}

  @Post('record')
  @UseGuards(JwtAuthGuard)
  async recordPlay(
    @Request() req,
    @Body() data: { 
      trackId: string, 
      sourceType: SourceType, 
      sourceId: string 
    }
  ) {
    const result = await this.listeningHistoryService.recordPlay(
      req.user.id, 
      data.trackId, 
      data.sourceType, 
      data.sourceId
    );
    
    return {
      message: 'Listening activity recorded successfully',
      data: result
    };
  }

  @Get('by-source')
  @UseGuards(JwtAuthGuard)
  async getHistoryBySource(@Request() req) {
    const result = await this.listeningHistoryService.getUserHistoryBySource(req.user.id);
    
    return {
      message: 'Listening history retrieved successfully',
      data: result
    };
  }
}