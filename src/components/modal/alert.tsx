import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createCallable } from 'react-call'

interface Props { message: string }
type Response = boolean

export const AlertConfirm = createCallable<Props, Response>(({ call, message }) => (
	<AlertDialog open={!call.ended}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
				{message}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => call.end(false)}>ยกเลิก</AlertDialogCancel>
      <AlertDialogAction onClick={() => call.end(true)}>ดำเนินการ</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
))