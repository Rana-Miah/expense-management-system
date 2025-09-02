import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
// import { UserButton, } from "@clerk/nextjs"
import { Home, Menu } from "lucide-react"
import { NavItem } from "./nav-item"
import Link from "next/link"
import { JSX } from "react"

type Route<T extends string = string> = {
  href: T;
  label: Capitalize<T>;
  Icon: JSX.Element;
}

const routes: Route[] = [
  {
    href: '/dashboard',
    label: "Dashboard",
    Icon: <Home size={18} />
  },
  {
    href: '/accounts',
    label: "Banks",
    Icon: <Home size={18} />
  },
  {
    href: '/transactions',
    label: "Transactions",
    Icon: <Home size={18} />
  },
  {
    href: '/transaction-name',
    label: "Transaction Name",
    Icon: <Home size={18} />
  },
  {
    href: '/shopkeepers',
    label: "Shopkeepers",
    Icon: <Home size={18} />
  },
]


export const MobileNavbar = async () => {

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white fixed top-0 left-0 right-0 w-full shadow-sm z-50">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="gap-3">
          <SheetHeader>
            <SheetTitle>Welcome, User</SheetTitle>
          </SheetHeader>

          {
            routes.map(
              item => (
                <SheetClose asChild>
                  <Link
                    href={item.href}
                  >
                    <NavItem nav={item} />
                  </Link>
                </SheetClose>
              )
            )
          }

        </SheetContent>
      </Sheet>
      <div>
        {/* <UserButton /> */}
        User button
      </div>
    </nav>
  )
}
