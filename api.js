const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const validater = require("./validaitons");

const client = new DynamoDBClient();
// Function to validate if a string contains only alphabetic characters

// Function to validate if a user is allowed to update specific fields
//   function isUserAuthorized(userRole, fieldToUpdate) {
//     if (userRole === "admin" || userRole === "hr") {
//       return true; // Admin and HR can edit all fields
//     } else if (userRole === "employee") {
//       // Employee can edit specific fields
//       const allowedFields = ['jobTitle', 'totalExperience', 'employmentStartDateInHyniva'];
//       return allowedFields.includes(fieldToUpdate);
//     }
//     return false;
//   }

const updateEmployeeDetail = async (event) => {
  const response = { statusCode: 200 };
  try {
    const body = JSON.parse(event.body);
    const fieldsToUpdate = [
      "jobTitle",
      "totalExperience",
      "employmentStartDateInHyniva",
      "supervisorName",
      "projectName",
      "clientName",
      "plannedJoiningDateInTheProject",
      "plannedEndDateInTheProject",
      "actualJoiningDateInTheProject",
      "actualEndDateInTheProject",
      "location",
      "billability",
      "remarksOnBillability",
      "laptopSpecification",
      "asset1",
      "asset2",
    ];

    // Filter the body object to include only the specified fields

    //   const updatedFields = {};
    //   for (const field of fieldsToUpdate) {
    //       if (body[field]) {
    //           updatedFields[field] = body[field];
    //           if("jobTitle"===field){
    //             validater.isAlphabetic(field);
    //           }
    //       }
    //   }

    const updatedFields = {};
    for (const field of fieldsToUpdate) {
        if ("jobTitle" === field) {
            validater.isAlphabetic(field);
        }
      if (body[field]) {
        updatedFields[field] = body[field];
      }
    }

    // Check if any fields to update were provided
    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update specified.");
    }

    const objKeys = Object.keys(updatedFields);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ eId: event.pathParameters.eId }),
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: updatedFields[key],
          }),
          {}
        )
      ),
    };

    const updateResult = await client.send(new UpdateItemCommand(params));
    response.body = JSON.stringify({
      message: "Successfully updated employee details.",
      updateResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to update employee details.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
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
