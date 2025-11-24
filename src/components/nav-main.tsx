import { Link } from "@tanstack/react-router"
import { ChevronRight, PieChart } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "@/components/ui/sidebar"

const items: {
	title: string
	items: {
		title: string
		url: string
		icon?: React.ComponentType<any>
		subtitle?: string
		items?: {
			title: string
			url: string
		}[]
	}[]
}[] = [
	{
		title: "Dashboard",
		items: [
			{
				title: "ภาพรวม",
				url: "#",
				icon: PieChart
			}
		]
	}
]
export function NavMain() {
	return (
		<SidebarGroup>
			{items.map((menu) => (
				<Fragment key={menu.title}>
					<SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
					{menu.items.map((item) => (
						<SidebarMenu key={item.title}>
							{item.items ? (
								<Collapsible
									key={item.title}
									asChild
									className="group/collapsible">
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{(item.items || [])?.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link to={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : (
								<Link to={item.url}>
									<SidebarMenuItem>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</Link>
							)}
						</SidebarMenu>
					))}
				</Fragment>
			))}
		</SidebarGroup>
	)
}
