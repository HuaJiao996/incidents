import { customFieldValidators, logger } from '@incidents/common'
import { type CreateAlertDTO } from './model'
import { databaseClient, type GlobalCustomField, type ServiceCustomField } from '@incidents/database'
import { get } from 'radash'

interface ValidationResult {
  valid: boolean;
  errors: Array<{ field: string; reason: string }>;
}

export async function validateGlobalCustomFields(
    createAlertDto: CreateAlertDTO,
  ): Promise<ValidationResult> {
    const globalCustomFields =
      await databaseClient.globalCustomField.findMany();
    return validateCustomFields(createAlertDto, globalCustomFields);
  }

export function validateCustomFields(
    createAlertDto: CreateAlertDTO,
    customFields: (GlobalCustomField | ServiceCustomField)[],
  ): ValidationResult {
    const errors: { field: string; reason: string }[] = [];

    for (const customField of customFields) {
      logger.debug(customField);
      const fieldValue = get<unknown>(
        createAlertDto.customFields,
        customField.path,
      );

      const validator = customFieldValidators[customField.type];
      if (!validator) {
        errors.push({
          field: customField.path,
          reason: `Unknown field type: ${customField.type}`,
        });
        continue;
      }

      const result = validator(
        customField.required,
        fieldValue,
        customField.enumValues as string[],
      );
      if (!result.valid) {
        errors.push({
          field: customField.path,
          reason:
            result.reason ||
            `Invalid value for field type: ${customField.type}`,
        });
      }
    }

    return {
      valid: !errors.length,
      errors,
    };
  }