const {
  DynamoDBClient,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient();
const manager="Manger";
const hr="hr";
const employee="employee";





// const updateEmployeeDetail = async (event) => {
//   const response = { statusCode: 200 };
//   try {
//       const body = JSON.parse(event.body);
//       const fieldsToUpdate = [
//           'jobTitle',
//           'totalExperience',
//           'employmentStartDateInHyniva',
//           'supervisorName',
//           'projectName',
//           'clientName',
//           'plannedJoiningDateInTheProject',
//           'plannedEndDateInTheProject',
//           'actualJoiningDateInTheProject',
//           'actualEndDateInTheProject',
//           'location',
//           'billability',
//           'remarksOnBillability',
//           'laptopSpecification',
//           'asset1',
//           'asset2',
//       ];

//       // Filter the body object to include only the specified fields
     
//       const updatedFields = {};
//       for (const field of fieldsToUpdate) {
//           if (body[field]) {
//               updatedFields[field] = body[field];
//           }
//       }

//       // Check if any fields to update were provided
//       if (Object.keys(updatedFields).length === 0) {
//           throw new Error('No fields to update specified.');
//       }

//       const objKeys = Object.keys(updatedFields);
//       const params = {
//           TableName: process.env.DYNAMODB_TABLE_NAME,
//           Key: marshall({ eId: event.pathParameters.eId }),
//           UpdateExpression: `SET ${objKeys
//               .map((_, index) => `#key${index} = :value${index}`)
//               .join(', ')}`,
//           ExpressionAttributeNames: objKeys.reduce(
//               (acc, key, index) => ({
//                   ...acc,
//                   [`#key${index}`]: key,
//               }),
//               {}
//           ),
//           ExpressionAttributeValues: marshall(
//               objKeys.reduce(
//                   (acc, key, index) => ({
//                       ...acc,
//                       [`:value${index}`]: updatedFields[key],
//                   }),
//                   {}
//               )
//           ),
//       };

//       const updateResult = await client.send(new UpdateItemCommand(params));
//       response.body = JSON.stringify({
//           message: 'Successfully updated employee details.',
//           updateResult,
//       });
//   } catch (e) {
//       console.error(e);
//       response.statusCode = 500;
//       response.body = JSON.stringify({
//           message: 'Failed to update employee details.',
//           errorMsg: e.message,
//           errorStack: e.stack,
//       });
//   }
//   return response;
// };




const updateEmployeeDetail = async (event, context) => {
    const response = { statusCode: 200 };
    const body = JSON.parse(event.body)
    await client.update({
         TableName: 'usersDB',
         Key:{
             id: event.pathParameters.id,
         },
         UpdateExpression: 'set totalExperience = :totalExperience, employmentStartDateInHyniva = :employmentStartDateInHyniva, supervisorName = :supervisorName, projectName = :projectName',

         ExpressionAttributeValues:{
            ':jobTitle': body.jobTitle,
            ':totalExperience': body.totalExperience,
            ':employmentStartDateInHyniva': body.employmentStartDateInHyniva,
            ':supervisorName': body.supervisorName,
            ':projectName': body.projectName,
         },
         ReturnValues: 'UPDATED_NEW',
     }).promise()
     response = {
             'statusCode': 200,
             'body': JSON.stringify({
                 message: 'User is Updated',
             })
         }
     return response
 };








module.exports = {
  updateEmployeeDetail,
};

// const {
//     DynamoDBClient,
//     UpdateItemCommand,
//   } = require('@aws-sdk/client-dynamodb');
//   const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
  
//   const client = new DynamoDBClient();

//   const updateEmployeeDetail = async (event) => {
//     const response = { statusCode: 200 };
//     try {
//       const body = JSON.parse(event.body);
//       const objKeys = Object.keys(body);
//       const params = {
//         TableName: process.env.DYNAMODB_TABLE_NAME,
//         Key: marshall({ eId: event.pathParameters.eId }),
//         UpdateExpression: `SET ${objKeys
//           .map((_, index) => `#key${index} = :value${index}`)
//           .join(', ')}`,
//         ExpressionAttributeNames: objKeys.reduce(
//           (acc, key, index) => ({
//             ...acc,
//             [`#key${index}`]: key,
//           }),
//           {}
//         ),
//         ExpressionAttributeValues: marshall(
//           objKeys.reduce(
//             (acc, key, index) => ({
//               ...acc,
//               [`:value${index}`]: body[key],
//             }),
//             {}
//           )
//         ),
//       };
//       const updateResult = await client.send(new UpdateItemCommand(params));
//       response.body = JSON.stringify({
//         message: 'Successfully updated post.',
//         updateResult,
//       });
//     } catch (e) {
//       console.error(e);
//       response.statusCode = 500;
//       response.body = JSON.stringify({
//         message: 'Failed to update post.',
//         errorMsg: e.message,
//         errorStack: e.stack,
//       });
//     }
//     return response;
//   };
  
  
//   module.exports = {
//     //updatePost,
//     updateEmployeeDetail,
//   };