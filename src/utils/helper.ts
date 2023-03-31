import {TFormField} from '_types/types';
import * as Yup from 'yup';

export const getFormFieldAndValidations = (fields: TFormField[]) => {
  const formFields: {[key: string]: any} = {};
  const validations: any = {};
  fields.forEach(field => {
    formFields[field.field.slug] = '';
    // making validations
    let validationYup = Yup.string();
    if (field.visible === 'required')
      validationYup = validationYup.required(
        `Required!`
      );
    field.validation_rules?.forEach(validation => {
      if (validation.slug == 'email') validationYup = validationYup.email();

      // confirmatio fields
      if (validation.slug == 'confirmed') {
        formFields['password_confirmation'] = '';
        validations['password_confirmation'] = Yup.string()
          .required('Confirmation is required!')
          .oneOf([Yup.ref(field.field.slug), null], 'Password should be match.');
      }
      // end confirmation field
    });
    validations[field.field.slug] = validationYup;
    // validations end
  });
  return {formFields, validations: Yup.object().shape(validations)};
};
