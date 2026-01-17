import { createFormHookContexts, createFormHook } from '@tanstack/react-form'
import { TextField } from './text';
import { BackButton, SubmitButton } from './submit';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField
  },
  formComponents: {
    BackButton,
    SubmitButton
  },
})