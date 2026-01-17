import { AlertConfirm } from "@/components/modal/alert";
import { useBlocker, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
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
  useFormBeforeUnload()
  const navigation =  useRouter()

  const onGoBack = () => {
    navigation.history.back()
  }

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="button" variant='secondary' disabled={isSubmitting} onClick={onGoBack}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export function useFormBeforeUnload() {
  const form = useFormContext();

   useBlocker({
    shouldBlockFn: async () => {
      if (!form.state.isDirty) return false
      const confirmed = await AlertConfirm.call({ message: "คุณแน่ใจหรือไม่ที่จะออกจากหน้านี้ มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก" })
      return !confirmed
    },
  })
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
