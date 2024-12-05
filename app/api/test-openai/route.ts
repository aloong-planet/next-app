// app/api/test-openai/route.ts
import OpenAI from 'openai'

export async function GET() {
    try {
        const config = {
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2023-05-15',
            hasApiKey: !!process.env.AZURE_OPENAI_API_KEY
        }

        console.log('Testing with configuration:', config)

        const openai = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
            defaultHeaders: {
                'api-key': process.env.AZURE_OPENAI_API_KEY!,
            },
            defaultQuery: {
                'api-version': process.env.AZURE_OPENAI_API_VERSION || '2023-05-15'
            }
        })

        // Test a simple completion
        const completion = await openai.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 50
        })

        return Response.json({
            success: true,
            response: completion,
            config
        })
    } catch (error: any) {
        console.error('Test endpoint error:', error)
        return Response.json({
            success: false,
            error: error.message,
            details: error.response?.data,
            config: {
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
                apiVersion: process.env.AZURE_OPENAI_API_VERSION,
                hasApiKey: !!process.env.AZURE_OPENAI_API_KEY
            }
        }, { status: 500 })
    }
}
