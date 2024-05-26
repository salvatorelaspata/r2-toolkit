import { test } from "node:test";
import assert from "node:assert/strict";
import {config} from 'dotenv'
config()

import {
  listBuckets,
  listObjects,
  getObject,
  getSignedUrl,
  putObject,
  deleteObject,
} from "../src/api.js";

const {CLOUDFLARE_R2_TEST_BUCKET_NAME, CLOUDFLARE_R2_TEST_KEY} = process.env;

test("should return a list of buckets", async () => {
  const response = await listBuckets();
  console.log(response)
  assert.equal(Array.isArray(response), true);
});

test("should return a list of objects", async () => {
  console.log(CLOUDFLARE_R2_TEST_BUCKET_NAME)
  const response = await listObjects(CLOUDFLARE_R2_TEST_BUCKET_NAME);
  assert.equal(Array.isArray(response), true);
});

test("should return an object", async () => {
  const response = await getObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, CLOUDFLARE_R2_TEST_KEY);
  assert.equal(typeof response === "object", true);
});

test("should return a signed URL", async () => {
  const response = await getSignedUrl(CLOUDFLARE_R2_TEST_BUCKET_NAME, CLOUDFLARE_R2_TEST_KEY);
  assert.equal(typeof response === "string", true);
});

test("Create and delete an object", async () => {
  const response = await putObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, "test.txt", "Hello World!");
  assert.equal(typeof response === "object", true);
  const deleteResponse = await deleteObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, "test.txt");
  assert.equal(typeof deleteResponse === "object", true);
  try {
    await getObject(CLOUDFLARE_R2_TEST_BUCKET_NAME, "test.txt");
  } catch (error) {
    assert.equal(error.name, "NoSuchKey");
  }
});