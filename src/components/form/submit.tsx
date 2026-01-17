import { useFormContext } from ".";
import { Button } from "../ui/button";

export function SubmitButton({ label = "บันทึก" }: { label?: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export function BackButton({ label = "ย้อนกลับ" }: { label?: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="button" variant='secondary' disabled={isSubmitting} onClick={() => history.back()}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

