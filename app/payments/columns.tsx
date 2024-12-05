"use client"

import {ColumnDef} from "@tanstack/react-table"
import {DataTableColumnHeader} from "@/components/table/column-header";
import {ColumnSelector} from "@/components/table/column-selector";
import ColumnActions from "@/components/table/column-actions";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

const handleEdit = (id: string) => {
    console.log("Edit payment", id)
}

const handleDelete = (id: string) => {
    console.log("Delete payment", id)
}

export const columns: ColumnDef<Payment>[] = [
    ColumnSelector as ColumnDef<Payment>,
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        )
    },
    {
        accessorKey: "email",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Email"/>
        )
    },
    {
        accessorKey: "amount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Amount"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        header: () => (<div className="text-center">Actions</div> ),
        id: "actions",
        cell: ({row}) => {
            const payment = row.original
            return (
                <ColumnActions id={payment.id} onEdit={handleEdit} onDelete={handleDelete}/>
            )
        },
    },
]
