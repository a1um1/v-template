import { Link, type LinkOptions } from "@tanstack/react-router"
import type { VariantProps } from "class-variance-authority"
import type * as React from "react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function ButtonLinks({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"a"> &
	LinkOptions &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	return (
		<Link
			className={cn(
				buttonVariants({
					variant,
					size,
					className
				})
			)}
			{...props}
		/>
	)
}

export { ButtonLinks }
