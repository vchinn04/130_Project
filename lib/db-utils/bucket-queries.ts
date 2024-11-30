import { S3 } from 'aws-sdk';
import { Resource } from 'sst';
import { GroupId, UserId } from '@/lib/db-utils/schemas';

const s3 = new S3();
const BUCKET_NAME = Resource.PromptAnswersBucket.name;

// Helper to generate consistent S3 keys
const getS3Key = (groupId: GroupId, userId: UserId) => {
  return `groups/${groupId}/members/${userId}/prompt-answer.txt`;
};

/**
 * Uploads a prompt answer to S3
 * @param groupId - The group ID
 * @param userId - The user ID
 * @param promptAnswer - The text content of the prompt answer
 * @returns The S3 URL where the answer is stored
 * @throws any errors that occur during the operation
 */
export async function uploadPromptAnswer(
  groupId: GroupId,
  userId: UserId,
  promptAnswer: string
): Promise<string> {
  const key = getS3Key(groupId, userId);

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: promptAnswer,
    ContentType: 'text/plain',
  }).promise();

  return `s3://${BUCKET_NAME}/${key}`;
}

/**
 * Retrieves a prompt answer from S3
 * @param groupId - The group ID
 * @param userId - The user ID
 * @returns The prompt answer text, or null if not found
 * @throws any errors that occur during the operation OTHER THAN errors for the object not being found
 */
export async function getPromptAnswer(
  groupId: GroupId,
  userId: UserId
): Promise<string | null> {
  try {
    const key = getS3Key(groupId, userId);

    const result = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).promise();

    return result.Body?.toString() || null;
  } catch (error) {
    if ((error as Error).name === 'NoSuchKey') {
      return null;
    }
    throw error;
  }
}

/**
 * Deletes a prompt answer from S3
 * @param groupId - The group ID
 * @param userId - The user ID
 * @throws any errors that occur during the operation other than the object not being found
 */
export async function deletePromptAnswer(
  groupId: GroupId,
  userId: UserId
): Promise<void> {
  const key = getS3Key(groupId, userId);

  await s3.deleteObject({
    Bucket: BUCKET_NAME,
    Key: key,
  }).promise();
}

/**
 * Checks if a prompt answer exists in S3 at a given key by checking the head object
 * @param groupId - The group ID
 * @param userId - The user ID
 * @returns boolean indicating if the answer exists
 * @throws any errors that occur during the operation OTHER THAN errors for the object not being found
 */
export async function promptAnswerExists(
  groupId: GroupId,
  userId: UserId
): Promise<boolean> {
  try {
    const key = getS3Key(groupId, userId);

    await s3.headObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).promise();

    return true;
  } catch (error) {
    if ((error as Error).name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

