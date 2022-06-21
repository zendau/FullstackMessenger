import { ApiProperty } from '@nestjs/swagger';

export class authSuccessDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJyb290QGdtYWlsLmNvbSIsImxvZ2luIjoidGVzdENhY2hlIiwicm9sZSI6eyJpZCI6MSwidmFsdWUiOiJhZG1pbiIsImFjY2Vzc0xldmVsIjoyfSwiaXNCYW5uZWQiOmZhbHNlLCJpYXQiOjE2NTU2MjcyMTYsImV4cCI6MTY1NTYyNzUxNn0.b_wAyEhMzoqB83A3eQLXRxCo6_DJYWUwzbMj04t8e5g',
    required: true,
    description: 'JWT access',
  })
  accessToken: boolean;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJyb290QGdtYWlsLmNvbSIsImxvZ2luIjoidGVzdENhY2hlIiwicm9sZSI6eyJpZCI6MSwidmFsdWUiOiJhZG1pbiIsImFjY2Vzc0xldmVsIjoyfSwiaXNCYW5uZWQiOmZhbHNlLCJpYXQiOjE2NTU2MjcyMTYsImV4cCI6MTY1NTYyNzUxNn0.b_wAyEhMzoqB83A3eQLXRxCo6_DJYWUwzbMj04t8e5g',
    required: true,
    description: 'JWT refresh',
  })
  refreshToken: string;
}