import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  LineChart,
  Settings,
  LogOut,
  BarChart2,
  BookUser,
  ShoppingBag,
  Landmark,
  Bus,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard",           href: "/",          icon: LayoutDashboard },
  { name: "Student Directory",   href: "/students",  icon: BookUser         },
  { name: "Bursary Accounts",    href: "/bursary",   icon: Landmark         },
  { name: "School Store",        href: "/store",     icon: ShoppingBag      },
  { name: "Bus Pass Register",   href: "/buspass",   icon: Bus              },
  { name: "Analytics & Revenue", href: "/analytics", icon: LineChart        },
  { name: "Support Desk",        href: "/support",   icon: Megaphone        },
  { name: "Team Management",     href: "/team",      icon: Users            },
  { name: "Settings",            href: "/settings",  icon: Settings         },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <ShadcnSidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 font-bold text-lg text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/20 border border-sidebar-primary/30">
            <BarChart2 className="h-4 w-4 text-sidebar-primary" />
          </div>
          <span className="truncate tracking-tight">Metrix</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={cn(
                    "font-medium tracking-tight transition-all duration-150",
                    isActive
                      ? "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/20"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Sign out</span>
        </Button>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
