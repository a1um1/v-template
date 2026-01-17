import { Link, NavigateOptions } from "@tanstack/react-router";
import { ChevronRight, PieChart, UsersIcon, Settings } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const items: {
  title: string;
  items: {
    title: string;
    url: NavigateOptions;
    icon?: React.ComponentType<any>;
    subtitle?: string;
    items?: {
      title: string;
      url: NavigateOptions;
    }[];
  }[];
}[] = [
    {
      title: "Dashboard",
      items: [
        {
          title: "ภาพรวม",
          url: {
            to: "/dashboard",
          },
          icon: PieChart,
        },
        {
          title: "Customer",
          url: {
            to: "/dashboard/customer",
          },
          icon: UsersIcon,
        },
      ],
    },
    {
      title: "ผู้ดูแลระบบ",
      items: [
        {
          title: "จัดการผู้ใช้",
          url: {
            to: "/dashboard/admin/users",
          },
          icon: Settings,
        },
      ],
    },
  ];

export function NavMain() {
  return (
    <SidebarGroup>
      {items.map((menu) => (
        <Fragment key={menu.title}>
          <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
          {menu.items.map((item) => (
            <SidebarMenu key={item.title}>
              {item.items ? (
                <Collapsible key={item.title} asChild className="group/collapsible">
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
                              <Link {...subItem.url}>
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
                <Link {...item.url}>
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
  );
}
