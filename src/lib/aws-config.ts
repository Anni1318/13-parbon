import 'server-only';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

// Initialize the AWS Bedrock client securely on the server-side.
// We explicitly use process.env to ensure it pulls strictly from environment variables.
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
