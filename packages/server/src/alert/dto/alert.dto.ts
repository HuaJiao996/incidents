import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";
import { AlertType } from "../../database/schema";

export class AlertDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ enum: ['trigger', 'resolve']})
    type: AlertType | undefined;

    @ApiPropertyOptional()
    customFields: Record<string, unknown> | undefined;
}