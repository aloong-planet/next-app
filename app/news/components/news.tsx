'use client';

import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface Post {
    objectID: number;
    author: string;
    title: string;
    url: string;
    created_at: string;
}

interface ClientComponentProps {
    initialSearch: string;
}

function getOneMonthAgoSecond(): number {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return Math.floor(oneMonthAgo.getTime() / 1000);
}

export default function ClientComponent({initialSearch}: ClientComponentProps) {
    const [search, setSearch] = useState(initialSearch);
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchData = async (query: string) => {
        const url = "https://hn.algolia.com/api/v1/search?tags=story";
        const response = await fetch(`${url}&numericFilters=created_at_i>${getOneMonthAgoSecond()}&query=${query}`);
        const data = await response.json();
        setPosts(data.hits);
    };

    useEffect(() => {
        fetchData(search);
    }, [search]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData(search);
    };

    const handlePresetSearch = (presetSearch: string) => {
        setSearch(presetSearch);
        fetchData(presetSearch);
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4">
                    <Input
                        className={"w-48"}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Topic"
                        value={search}/>
                    <Button type="submit" variant="outline">search</Button>
                    <div className="flex space-x-1">
                        <Button onClick={() => handlePresetSearch('rust')} className="bg-blue-500">Rust</Button>
                        <Button onClick={() => handlePresetSearch('llm')} className="bg-blue-500">LLM</Button>
                        <Button onClick={() => handlePresetSearch('ebpf')} className="bg-blue-500">eBPF</Button>
                    </div>
                </form>

            </div>
            <div>
                <div className="flex px-4 py-2 bg-gray-200 font-bold">
                    {/*<p className="w-40">Author</p>*/}
                    <p className="w-48">Created At</p>
                    <p className="flex-1">Title</p>
                </div>
                <ul>
                    {posts.map((post: Post) => (
                        <li className="flex h-6 px-4" key={post.objectID}>
                            {/*<p className="w-40">{post.author}</p>*/}
                            <p className="w-48 text-sm flex items-center">{post.created_at}</p>
                            {post.url ? (
                                <Link href={post.url} target="_blank"
                                      className="text-blue-600 hover:text-blue-300 text-sm flex items-center"
                                >{post.title}</Link>) : (
                                <p className="flex-1 text-sm">{post.title}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
