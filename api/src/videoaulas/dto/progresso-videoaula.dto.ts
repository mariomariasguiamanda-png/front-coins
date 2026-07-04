import { IsInt, Max, Min } from 'class-validator';

export class ProgressoVideoaulaDto {
  @IsInt()
  @Min(0)
  @Max(100)
  percentual_assistido: number;
}
