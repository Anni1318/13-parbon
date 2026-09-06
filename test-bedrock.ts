import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

client.send(new ConverseCommand({
  modelId: 'meta.llama3-8b-instruct-v1:0',
  messages: [{ role: 'user', content: [{ text: 'Who are you?' }] }]
}))
.then(r => console.log('✅ API TEST SUCCESS! Response:', JSON.stringify(r.output?.message?.content)))
.catch(e => console.error('❌ API TEST FAILED:', e.name, '-', e.message));
