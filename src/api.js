import {
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl as signUrl } from '@aws-sdk/s3-request-presigner';
import { clientS3 } from "./clientS3.js";

export const listBuckets = async () => {
  const response = await clientS3.send(new ListBucketsCommand({}));
  return response.Buckets;
}

export const listObjects = async (Bucket) => {
  const response = await clientS3.send(new ListObjectsV2Command({ Bucket }));
  return response.Contents;
}

export const getObject = async (Bucket, Key) => {
  const response = await clientS3.send(new GetObjectCommand({ Bucket, Key }));
  return response.Body;
}

export const putObject = async (Bucket, Key, Body) => {
  const response = await clientS3.send(new PutObjectCommand({ Bucket, Key, Body }));
  return response;
}

export const getSignedUrl = async (Bucket, Key) => {
  const signedUrl = await signUrl(clientS3, new GetObjectCommand({ Bucket, Key }));
  return signedUrl;
}

export const deleteObject = async (Bucket, Key) => {
  const response = await clientS3.send(new DeleteObjectCommand({ Bucket, Key }));
  return response;
}