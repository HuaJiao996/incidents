import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AlertType } from "../../database/schema";

export class AlertDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    type: AlertType;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional()
    customFields: Record<string, unknown> | undefined;
}