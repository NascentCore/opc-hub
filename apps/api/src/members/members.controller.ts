import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';

class CreateMemberDto {
  organizationId!: string;
  name!: string;
  email!: string;
  roleId!: string;
  status?: string;
}

class UpdateMemberDto {
  roleId?: string;
  status?: string;
}

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.membersService.findAll(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(@Body() dto: CreateMemberDto) {
    const result = await this.membersService.create(dto);
    return { data: result };
  }

  @Patch(':memberId')
  async update(@Param('memberId') memberId: string, @Body() dto: UpdateMemberDto) {
    const result = await this.membersService.update(memberId, dto);
    return { data: result };
  }
}
