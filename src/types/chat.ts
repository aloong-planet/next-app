export type Role = 'user' | 'assistant' | 'system'

export interface Message {
    id: string
    role: Role
    content: string
    createdAt: number
}

export interface Chat {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    updatedAt: number
}

export interface ChatMessage {
    role: Role
    content: string
}