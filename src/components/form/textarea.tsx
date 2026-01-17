import { HTMLAttributes } from "react";
import { useFieldContext } from ".";
import { Textarea } from "../ui/textarea";
import { BaseField, BaseFieldProps } from "./base";

type TextAreaFieldProps = BaseFieldProps & HTMLAttributes<HTMLTextAreaElement>

export function TextAreaField({
  label,
  description,
  required,
	children,
	...props
}: TextAreaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <BaseField
      label={label}
      description={description}
      required={required}
    >
      <Textarea
				{...props}
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </BaseField>
  );
}
