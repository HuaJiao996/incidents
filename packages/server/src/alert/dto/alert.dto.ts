import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";
import { AlertType } from "../../database/schema";

export class AlertDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsEmpty()
    type: AlertType | undefined;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional()
    customFields: Record<string, unknown> | undefined;
}