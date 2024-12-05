import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            "id": "728ed52f",
            "amount": 1,
            "status": "pending",
            "email": "m1@example.com"
        },
        {
            "id": "a1b2c3d4",
            "amount": 2,
            "status": "pending",
            "email": "m2@example.com"
        },
        {
            "id": "e5f6g7h8",
            "amount": 3,
            "status": "pending",
            "email": "m3@example.com"
        },
        {
            "id": "i9j0k1l2",
            "amount": 4,
            "status": "pending",
            "email": "m4@example.com"
        },
        {
            "id": "m3n4o5p6",
            "amount": 5,
            "status": "pending",
            "email": "m5@example.com"
        },
        {
            "id": "q7r8s9t0",
            "amount": 6,
            "status": "pending",
            "email": "m6@example.com"
        },
        {
            "id": "u1v2w3x4",
            "amount": 7,
            "status": "pending",
            "email": "m7@example.com"
        },
        {
            "id": "y5z6a7b8",
            "amount": 8,
            "status": "pending",
            "email": "m8@example.com"
        },
        {
            "id": "c9d0e1f2",
            "amount": 9,
            "status": "pending",
            "email": "m9@example.com"
        },
        {
            "id": "g3h4i5j6",
            "amount": 10,
            "status": "pending",
            "email": "m10@example.com"
        },
        {
            "id": "k7l8m9n0",
            "amount": 11,
            "status": "pending",
            "email": "m11@example.com"
        },
        {
            "id": "o1p2q3r4",
            "amount": 12,
            "status": "pending",
            "email": "m12@example.com"
        },
        {
            "id": "s5t6u7v8",
            "amount": 13,
            "status": "pending",
            "email": "m13@example.com"
        },
        {
            "id": "w9x0y1z2",
            "amount": 14,
            "status": "pending",
            "email": "m14@example.com"
        },
        {
            "id": "a3b4c5d6",
            "amount": 15,
            "status": "pending",
            "email": "m15@example.com"
        },
        {
            "id": "e7f8g9h0",
            "amount": 16,
            "status": "pending",
            "email": "m16@example.com"
        },
        {
            "id": "i1j2k3l4",
            "amount": 17,
            "status": "pending",
            "email": "m17@example.com"
        },
        {
            "id": "m5n6o7p8",
            "amount": 18,
            "status": "pending",
            "email": "m18@example.com"
        },
        {
            "id": "q9r0s1t2",
            "amount": 19,
            "status": "pending",
            "email": "m19@example.com"
        },
        {
            "id": "u3v4w5x6",
            "amount": 20,
            "status": "pending",
            "email": "m20@example.com"
        },
        {
            "id": "y7z8a9b0",
            "amount": 21,
            "status": "pending",
            "email": "m21@example.com"
        },
        {
            "id": "c1d2e3f4",
            "amount": 22,
            "status": "pending",
            "email": "m22@example.com"
        },
        {
            "id": "g5h6i7j8",
            "amount": 23,
            "status": "pending",
            "email": "m23@example.com"
        },
        {
            "id": "k9l0m1n2",
            "amount": 24,
            "status": "pending",
            "email": "m24@example.com"
        },
        {
            "id": "o3p4q5r6",
            "amount": 25,
            "status": "pending",
            "email": "m25@example.com"
        },
        {
            "id": "s7t8u9v0",
            "amount": 26,
            "status": "pending",
            "email": "m26@example.com"
        },
        {
            "id": "w1x2y3z4",
            "amount": 27,
            "status": "pending",
            "email": "m27@example.com"
        },
        {
            "id": "a5b6c7d8",
            "amount": 28,
            "status": "pending",
            "email": "m28@example.com"
        },
        {
            "id": "e9f0g1h2",
            "amount": 29,
            "status": "pending",
            "email": "m29@example.com"
        },
        {
            "id": "i3j4k5l6",
            "amount": 30,
            "status": "pending",
            "email": "m30@example.com"
        },
        {
            "id": "m7n8o9p0",
            "amount": 31,
            "status": "pending",
            "email": "m31@example.com"
        },
        {
            "id": "q1r2s3t4",
            "amount": 32,
            "status": "pending",
            "email": "m32@example.com"
        },
        {
            "id": "u5v6w7x8",
            "amount": 33,
            "status": "pending",
            "email": "m33@example.com"
        },
        {
            "id": "y9z0a1b2",
            "amount": 34,
            "status": "pending",
            "email": "m34@example.com"
        },
        {
            "id": "c3d4e5f6",
            "amount": 35,
            "status": "pending",
            "email": "m35@example.com"
        },
        {
            "id": "g7h8i9j0",
            "amount": 36,
            "status": "pending",
            "email": "m36@example.com"
        },
        {
            "id": "k1l2m3n4",
            "amount": 37,
            "status": "pending",
            "email": "m37@example.com"
        },
        {
            "id": "o5p6q7r8",
            "amount": 38,
            "status": "pending",
            "email": "m38@example.com"
        },
        {
            "id": "s9t0u1v2",
            "amount": 39,
            "status": "pending",
            "email": "m39@example.com"
        },
        {
            "id": "w3x4y5z6",
            "amount": 40,
            "status": "pending",
            "email": "m40@example.com"
        },
        {
            "id": "a7b8c9d0",
            "amount": 41,
            "status": "pending",
            "email": "m41@example.com"
        },
        {
            "id": "e1f2g3h4",
            "amount": 42,
            "status": "pending",
            "email": "m42@example.com"
        },
        {
            "id": "i5j6k7l8",
            "amount": 43,
            "status": "pending",
            "email": "m43@example.com"
        },
        {
            "id": "m9n0o1p2",
            "amount": 44,
            "status": "pending",
            "email": "m44@example.com"
        },
        {
            "id": "q3r4s5t6",
            "amount": 45,
            "status": "pending",
            "email": "m45@example.com"
        },
        {
            "id": "u7v8w9x0",
            "amount": 46,
            "status": "pending",
            "email": "m46@example.com"
        },
        {
            "id": "y1z2a3b4",
            "amount": 47,
            "status": "pending",
            "email": "m47@example.com"
        },
        {
            "id": "c5d6e7f8",
            "amount": 48,
            "status": "pending",
            "email": "m48@example.com"
        },
        {
            "id": "g9h0i1j2",
            "amount": 49,
            "status": "pending",
            "email": "m49@example.com"
        },
        {
            "id": "k3l4m5n6",
            "amount": 50,
            "status": "pending",
            "email": "m50@example.com"
        }
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
