import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { BackButton, SubmitAndBackButtons, SubmitButton } from './submit';
import { TextField } from './text';
import { TextAreaField } from './textarea';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField,
  },
  formComponents: {
    BackButton,
    SubmitButton,
    FooterBar: SubmitAndBackButtons
  },
})