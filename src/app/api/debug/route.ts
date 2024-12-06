// app/api/debug/route.ts
export async function GET() {
    return Response.json({
        env: {
            apiKey: process.env.AZURE_OPENAI_API_KEY ? 'Set' : 'Not set',
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        }
    })
}