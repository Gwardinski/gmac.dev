import type { ValidationError } from './api-models';

export function mapAPIErrorsToForm(validationErrors: ValidationError[] | undefined, formApi: any): boolean {
  if (!validationErrors || validationErrors.length === 0) {
    return false;
  }

  validationErrors.forEach((validationError: ValidationError) => {
    const fieldName = validationError.path;
    const errorMessage = validationError.message || validationError.summary;

    try {
      const fieldInfo = formApi.fieldInfo[fieldName];

      if (fieldInfo?.instance) {
        const fieldInstance = fieldInfo.instance;

        fieldInstance.state.meta = {
          ...fieldInstance.state.meta,
          isTouched: true,
          errors: [{ message: errorMessage }],
          errorMap: { onSubmit: errorMessage }
        };
        // re-render required
        fieldInstance.store.setState(() => fieldInstance.state);
      } else {
      }
    } catch (e) {}
  });

  return true;
}
