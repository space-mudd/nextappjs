/*
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

const decrementCredit = async (userId: string) => {
  const command = new UpdateCommand({
    TableName: "UserConversations",
    Key: {
      userId: userId,
    },
    UpdateExpression: "SET conversationCount = conversationCount - :decrement",
    ExpressionAttributeValues: {
      ":decrement": 1,
      ":zero": 0, // Burada :zero ifadesini tanımlayın
    },
    ConditionExpression: "conversationCount > :zero",
    ReturnValues: "UPDATED_NEW",
  });
  
  try {
    const response = await docClient.send(command);
    console.log(response);
    return response.Attributes.conversationCount;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      console.log("No credits available for the user");
      return 0;
    }
    throw error;
  }
};

export async function POST(request: Request) {
  const cookies = request.headers.get("cookie");
  
  if (!cookies) {
    return new Response("Session cookie is required", { status: 400 });
  }
  
  const parsedCookies = cookies.split("; ").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);
  
  const userId = parsedCookies["userId"];
  
  if (!userId) {
    return new Response("Invalid session cookie", { status: 401 });
  }
  
  const remainingCredits = await decrementCredit(userId);
  
  return new Response(JSON.stringify({ remainingCredits }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

*/
