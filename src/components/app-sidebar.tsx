"use client"

import { UserButton } from "@daveyplate/better-auth-ui"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { Box } from "lucide-react"
import type * as React from "react"
import { NavMain } from "@/components/nav-main"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ButtonGroup } from "@/components/ui/button-group"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar
} from "@/components/ui/sidebar"
import { useUser } from "@/data/auth"
import { Badge } from "@/components/ui/badge"
import { useAppVersion } from "@/data/appVersion"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: user, isLoading } = useUser()
	const appVersion = useAppVersion()
	return (
		<Sidebar
			collapsible="icon"
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
									<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
										<Box className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">Back office</span>
										<div>
											<ButtonGroup>
												{isLoading ? (
													<Badge
														className="w-12"
														variant="loading"
													/>
												) : (
													<Badge className="text-purple-500">
														{user?.user.role}
													</Badge>
												)}

												<Badge className="text-blue-500 font-mono font-bold">
													{appVersion.data?.appVersion}
												</Badge>
											</ButtonGroup>
										</div>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<UserButtonCustom />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

export const UserButtonCustom = ({
	type = "sidebar"
}: {
	type?: "navbar" | "sidebar"
}) => {
	const { state } = useSidebar()
	return (
		<UserButton
			classNames={
				type === "sidebar"
					? {
							"content": {
								user: {
									"avatar": {
										"fallback": "bg-primary text-primary-foreground",
										"base": "size-9"
									}
								}
							},
							"trigger": {
								user: {
									"avatar": {
										"fallback": "bg-primary text-primary-foreground",
										"base": "size-9"
									}
								}
							}
						}
					: {
							"trigger": {
								"user": {
									"content": "inline not-md:hidden",
									"base": "flex-row-reverse",
									"avatar": {
										"fallback": "bg-primary text-primary-foreground",
										"base": "size-9"
									}
								},
								"base": "[&_svg]:hidden"
							},
							"content": {
								base: "mr-2",
								user: {
									"avatar": {
										"fallback": "bg-primary text-primary-foreground",
										"base": "size-9"
									}
								}
							}
						}
			}
			disableDefaultLinks
			size={type === "sidebar" ? (state === "collapsed" ? "icon" : "lg") : "sm"}
			variant={type === "sidebar" ? "secondary" : "ghost"}
		/>
	)
}
