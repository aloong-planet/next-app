import ClientComponent from "@/src/app/news/components/news";

export default async function Page() {
    const initialSearch = 'Rust';

    return <ClientComponent initialSearch={initialSearch}/>;
}
