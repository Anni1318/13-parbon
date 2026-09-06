import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { BedrockClient, ListFoundationModelsCommand } from '@aws-sdk/client-bedrock';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const region = process.env.AWS_REGION || 'ap-south-1';
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};

const bedrock = new BedrockClient({ region, credentials });
const runtime = new BedrockRuntimeClient({ region, credentials });

async function findAllowedModel() {
  console.log('Fetching models...');
  const res = await bedrock.send(new ListFoundationModelsCommand({}));
  const models = res.modelSummaries?.map(m => m.modelId) || [];
  console.log(`Found ${models.length} models. Testing...`);

  for (const modelId of models) {
    if (!modelId) continue;
    try {
      await runtime.send(new ConverseCommand({
        modelId,
        messages: [{ role: 'user', content: [{ text: 'Hi' }] }]
      }));
      console.log(`\n✅ SUCCESS: ${modelId} is ALLOWED!`);
      return;
    } catch (e: any) {
      if (e.name !== 'ValidationException') {
        console.log(`\n⚠️ ERROR for ${modelId}: ${e.name} - ${e.message}`);
      } else {
        process.stdout.write('.');
      }
    }
  }
  console.log('\n❌ No models allowed.');
}

findAllowedModel();
