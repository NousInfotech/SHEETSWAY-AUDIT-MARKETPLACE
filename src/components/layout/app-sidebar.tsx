// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { auth } from '@/lib/firebase';
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle
} from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '../ui/button';
import { StaticOrgDisplay } from '../static-org-display';
import { useAuth } from './providers';

// 1. Import the main Tabler icons map for the default icons
import { Icons } from '../icons';

// 2. Import the specific Lucide icon for the "Request" item
import { FilePlus2, Search, Sigma } from 'lucide-react';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const company = {
  name: 'Acme Inc',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};

const tenants = [
  { id: '1', name: 'Acme Inc' },
  { id: '2', name: 'Beta Corp' },
  { id: '3', name: 'Gamma Ltd' }
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const handleSwitchTenant = (tenantId: string) => {
    // Tenant switching functionality would be implemented here
    console.log('Switching to tenant:', tenantId);
  };

  const activeTenant = tenants[0];

  const activeStyles =
    'data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:hover:bg-amber-600 data-[active=true]:hover:text-white';

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        {/* <StaticOrgDisplay app='Audit Market Place' name='Sheetsway' /> */}
        {state === 'expanded' ? (
          <div className='mx-auto w-[95%]'>
            <img src='/assets/sheetswaylogo.png' alt='logo' />
          </div>
        ) : (
          <div>
            <img
              src='/favicon/favicon.svg'
              alt='logo'
              className='mx-auto h-6 w-6'
            />
          </div>
        )}
        {state === 'expanded' ? (
          <>
            <div className='relative mx-auto my-2 w-[95%]'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input placeholder='search ...' className='pl-10' />
            </div>
          </>
        ) : (
          <div className='flex justify-center'>
            <Search className='h-4 w-4' />
          </div>
        )}
        <div className='flex w-full justify-center'>
          <Separator className='!w-[95%]' />
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Overview</SidebarGroupLabel> */}
          <SidebarMenu>
            {navItems.map((item) => {
              // We'll handle both collapsible and direct links
              const isParentActive =
                item.items && item.items.length > 0
                  ? item.items.some((subItem) => pathname === subItem.url)
                  : false;
              const isDirectlyActive = pathname === item.url;
              const isActive = isParentActive || isDirectlyActive;

              let iconElement = null;

              // 1. Choose the correct icon path (active or default)
              const iconPath =
                isActive && item.activeIcon ? item.activeIcon : item.icon;

              // 2. If a path exists, create an <img> element
              const activeIconFilter = 'brightness-0 invert';
              if (iconPath) {
                iconElement = (
                  <img
                    src={iconPath}
                    alt={`${item.title} icon`}
                    className={cn(
                      // Argument 1: A conditional string (or false)
                      isActive && activeIconFilter,

                      // Argument 2: A static string of base classes
                      'transition-all duration-200 dark:brightness-0 dark:invert',

                      // Argument 3: A conditional string for sizing
                      state === 'expanded' ? 'h-5 w-5' : 'h-4 w-4'
                    )}
                  />
                );
              }

              if (!iconElement) return null; // Don't render if there's no icon

              // Render collapsible menu if it has items
              if (item.items && item.items.length > 0) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isParentActive}
                    className='group/collapsible'
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isParentActive}
                          className={activeStyles}
                        >
                          {iconElement}
                          <span>{item.title}</span>
                          <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {/*  sub-menu-items below if needed */}
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              // Render a regular menu item
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isDirectlyActive}
                    className={activeStyles}
                  >
                    <Link href={item.url}>
                      {iconElement} {/* Render the chosen icon element */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {firebaseUser && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={firebaseUser}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {firebaseUser && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={firebaseUser}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className='mr-2 h-4 w-4' />
                  <Button
                    onClick={async () => {
                      await signOut(auth);
                      router.push('/auth/sign-in');
                    }}
                  >
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
