import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { NextRequest } from "next/server";

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AUTH_DYNAMODB_ID || "",
    secretAccessKey: process.env.AUTH_DYNAMODB_SECRET || "",
  },
  region: process.env.AUTH_DYNAMODB_REGION || "",
});
const ddbDocClient = DynamoDBDocumentClient.from(client);
export async function POST(req: NextRequest) {
  console.log("first");
  const body = await req.json();
  const userId = body.userId;

  const command = new UpdateCommand({
    TableName: "next-auth",
    Key: { pk: `USER#${userId}`, sk: `USER#${userId}` },
    UpdateExpression: "SET kredi = if_not_exists(kredi, :start) + :inc",
    ExpressionAttributeValues: {
      ":inc": 3,
      ":start": 0,
    },
    ReturnValues: "UPDATED_NEW",
  });

  const result = await ddbDocClient.send(command);
  return new Response("OK");
}
