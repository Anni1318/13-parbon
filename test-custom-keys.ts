import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' }); // Using the separate test file
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

async function testKeys() {
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (!accessKeyId || accessKeyId.includes('PUT_NEW_KEY_HERE')) {
    console.error("❌ Please put your real keys in .env.test before running this script!");
    return;
  }

  console.log(`Testing keys ending in ...${accessKeyId.slice(-4)} in region ${region}`);

  const client = new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey: secretAccessKey as string },
  });

  try {
    const response = await client.send(new ConverseCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      messages: [{ role: 'user', content: [{ text: 'Hello, are you there?' }] }]
    }));
    
    console.log('\n✅ API TEST SUCCESS! The keys are fully working.');
    console.log('Response:', response.output?.message?.content?.[0]?.text);
    console.log('\nIf this worked, you can copy these keys over to your main .env.local file!');
  } catch (e: any) {
    console.error('\n❌ API TEST FAILED');
    console.error(`Error Type: ${e.name}`);
    console.error(`Message: ${e.message}`);
  }
}

testKeys();
