import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    ScanCommand,
    DynamoDBDocumentClient,
    PutCommand
} from '@aws-sdk/lib-dynamodb'

import * as AWS from 'aws-sdk'
import * as _ from 'lodash'

// const dynamoDb = new AWS.DynamoDB.DocumentClient()

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)
const tableName = 'items'

interface HelloResponse {
   statusCode: number;
   body: string;
}

export const hello: Handler = async (event: any, context: Context, callback: Callback) => {
  let statusCode = 200
  let body;
  const headers = {
      'Content-Type': 'application/json'
  }

  try {
      switch(event.routeKey) {
          case 'GET /hello':
              // await dynamoDb.scan(
              //   { TableName: tableName },
              //   (error, result) => {
              //     console.log('!!!error', error)
              //     console.log('!!!result', result)
              //     if (error) {
              //       throw error
              //     }

              //     body = result.Items
              //   }
              // )
              const dbResponse = await dynamo.send(
                new ScanCommand({ TableName: tableName })
              )

            body = dbResponse.Items
          break;
          default:
              throw new Error(`Unsupported route: ${event.routeKey}`)
      }
  } catch (error: any) {
      statusCode = 400
      body = error.message
  } finally {
    console.log('!!!body', body)

    body = JSON.stringify(body)
  }

  const response = {
      statusCode,
      body,
      headers
  };

  console.log('!!!response', response)

  return response;
};
