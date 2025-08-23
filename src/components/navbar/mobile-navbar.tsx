import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import { UserButton, } from "@clerk/nextjs"
import { Home, Menu } from "lucide-react"
import { NavItem } from "./nav-item"

export const MobileNavbar = async () => {

  return (
    <nav className="flex items-center justify-between py-4">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="gap-3">
          <SheetHeader>
            <SheetTitle>Welcome, User</SheetTitle>
          </SheetHeader>

          {
            [
              {
                href: '/',
                label: "Home",
                Icon: <Home size={18} />
              },
              {
                href: '/dashboard',
                label: "Dashboard",
                Icon: <Home size={18} />
              },

            ].map(
              item => (
                <SheetClose key={item.label}>
                  <NavItem nav={item} />
                </SheetClose>
              )
            )
          }

        </SheetContent>
      </Sheet>
      <div>
        <UserButton />
      </div>
    </nav>
  )
}
