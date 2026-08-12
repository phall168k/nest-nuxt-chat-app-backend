import { ValidationError } from 'class-validator';

export function formatValidationErrors(
  validationErrors: ValidationError[],
  parentPath = '',
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const error of validationErrors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      errors[propertyPath] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      Object.assign(
        errors,
        formatValidationErrors(
          error.children,
          propertyPath,
        ),
      );
    }
  }

  return errors;
}