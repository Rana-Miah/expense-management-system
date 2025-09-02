import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Shopkeeper } from "@/constant/dummy-db/shopkeepers";
import { dateFormatter } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, BadgeX, Copy, ShoppingCart } from "lucide-react";
import Link from "next/link";


export const shopkeeperColumns: ColumnDef<Shopkeeper>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row: { original: { name, createdAt } } }) => {
            return (
                <>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{dateFormatter(new Date(createdAt), 'dd MMMM, yyyy')}</CardDescription>
                </>
            )
        }
    },
    {
        accessorKey: 'phone',
        header: 'Phone Number',
        cell: ({ row: { original: { phone } } }) => {
            return <PhoneColumnCell phone={phone} />
        }
    },
    {
        accessorKey: 'isBan',
        header: 'Status',
        cell: ({ row: { original: { isBan } } }) => {
            return (
                <Badge
                    className="flex items-center gap-1.5 rounded-full"
                    variant={isBan ? 'destructive' : 'success'}
                >
                    {
                        isBan ? <BadgeX /> : <BadgeCheck />
                    }
                    <span>{
                        isBan ? "Ban" : "Not Ban"
                    }</span>
                </Badge>
            )
        }
    },
    {
        id: 'Purchase',
        header: 'Purchase',
        cell: ({ row: { original: { isBan, id } } }) => {
            return (
                <>{
                    !isBan && (
                        <Link
                            href={`/shopkeepers/${id}/purchase-item`}
                        >
                            <Button
                                className="flex items-center gap-1.5"
                            >
                                <ShoppingCart />
                                <span>Purchase Item</span>
                            </Button>
                        </Link>
                    )
                }</>
            )
        }
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ({ row: { original: { name, phone, isBan, createdAt, updatedAt } } }) => {
            return (
                <span>{dateFormatter(new Date(createdAt))}</span>
            )
        }
    },
]

const PhoneColumnCell = ({ phone }: { phone: string }) => {
    const onCopyHander = async () => {
        await navigator.clipboard.writeText(phone)
        alert('Copied ' + phone)
    }
    return (
        <div className="flex items-center gap-1.5">
            <span
                className="bg-secondary p-2 rounded-sm"
            >{
                    phone
                }</span>
            <Button
                variant='secondary'
                onClick={onCopyHander}
            >
                <Copy />
            </Button>
        </div>
    )
}