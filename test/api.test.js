// test api
import { test } from "node:test";
import assert from "node:assert";
import {config} from 'dotenv'
config()

import {
  listBuckets,
  listObjects,
  getObject,
  getSignedUrl,
  putObject,
  deleteObject,
  createBucket,
  deleteEmptyBucket,
} from "../src/api.js";

const {CLOUDFLARE_R2_TEST_BUCKET_NAME} = process.env;

test("should return a list of buckets", async () => {
  const response = await listBuckets();
  assert.strictEqual(Array.isArray(response), true);
});

test("should return a list of objects", async () => {
  const response = await listObjects(CLOUDFLARE_R2_TEST_BUCKET_NAME);
  assert.strictEqual(Array.isArray(response), true);
});

test("should return an object", async () => {
  const file = "hello.txt";
  const create = await putObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file, "Hello World!");
  assert.strictEqual(typeof create === "object", true);
  const response = await getObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  assert.strictEqual(typeof response === "object", true);
  const deleteResponse = await deleteObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  assert.strictEqual(typeof deleteResponse === "object", true);
});

test("should return a signed URL", async () => {
  const file = "hello.txt";
  const create = await putObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file, "Hello World!");
  assert.strictEqual(typeof create === "object", true);
  const response = await getSignedUrl(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  assert.strictEqual(typeof response === "string", true);
  const deleteResponse = await deleteObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  assert.strictEqual(typeof deleteResponse === "object", true);
});

test("Create and delete an object", async () => {
  const file = "test.txt";
  const response = await putObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file, "Hello World!");
  assert.strictEqual(typeof response === "object", true);
  const deleteResponse = await deleteObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  assert.strictEqual(typeof deleteResponse === "object", true);
  try {
    await getObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, file);
  } catch (error) {
    assert.strictEqual(error.name, "NoSuchKey");
  }
});
const ts = Date.now();

// test create bucket
test("should create a bucket", async () => {  
  const bucketName = "test-bucket-" + ts;
  const response = await createBucket(bucketName);
  assert.strictEqual(typeof response === "object", true);
});

// test delete bucket
test("should delete a bucket", async () => {
  const bucketName = "test-bucket-" + ts;
  const response = await deleteEmptyBucket(bucketName);
  assert.strictEqual(typeof response === "object", true);
});

test.after(() => {
  console.log('All tests completed, exiting.');
  process.exit(0);
});