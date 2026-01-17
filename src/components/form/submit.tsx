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

export function SubmitAndBackButtons({
  submitLabel = "บันทึก",
  backLabel = "ย้อนกลับ"
}: {
  submitLabel?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex gap-3 pt-4 justify-between">
      <BackButton label={backLabel} />
      <SubmitButton label={submitLabel} />
    </div>
  )
}
