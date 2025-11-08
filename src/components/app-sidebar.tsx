"use client";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Box } from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
										<Box className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">Hello</span>
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
			<SidebarRail />
		</Sidebar>
	);
}
