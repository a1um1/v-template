import { placeholder } from "drizzle-orm";
import { useFieldContext } from ".";
import { Label } from "../ui/label";

export interface BaseFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export function BaseField({
  label,
  description,
  required,
  children,
}: BaseFieldProps) {
  const field = useFieldContext();
  const errorMessage = field.state.meta.errors[0];

  return (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={field.name} required={required} className="mb-2">
          {label}
        </Label>
      )}
      <div>{children}</div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
      {description && !errorMessage && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
