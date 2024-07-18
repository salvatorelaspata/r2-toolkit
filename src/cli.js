#!/usr/bin/env node

import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { program } from "commander";
import ascii from "./ascii.js";
import {
  createBucket,
  deleteEmptyBucket,
  deleteObject,
  getObject,
  listBuckets,
  listObjects,
} from "./api.js";
import {
  log,
  objectToChoices,
  printObjects,
  sizeToHumanReadable,
  totalSize,
} from "./util.js";
import { allOrSelectedChoices, bucketsQ, todoQ } from "./choises.js";

const runCLI = async () => {
  // todo
  const todo = await select({
    message: todoQ.message,
    choices: todoQ.choices,
  });
  const objects = [];
  const objectChoices = [];
  if (todo !== "create") {
    // list buckets
    const buckets = await listBuckets();
    if (!buckets || buckets.length === 0) {
      log.error("No buckets found");
      process.exit(1);
    }

    // select bucket
    const bucketName = await select({
      message: bucketsQ.message,
      choices: bucketsQ.choices(buckets),
    });

    let selectedBucket = [];
    if (bucketName === "all") selectedBucket = buckets;
    else
      selectedBucket.push(buckets.find((bucket) => bucket.Name === bucketName));

    // list objects for each selected bucket
    for (const bucket of selectedBucket) {
      log.info(`Listing objects in bucket ${bucket.Name}`);
      const _objects = await listObjects(bucket.Name);
      if (!_objects || _objects.length === 0) {
        log.info(`No objects in bucket ${bucket.Name}`);
        continue;
      } else {
        log.info(`Found ${_objects.length} objects in bucket ${bucket.Name}`);
      }
      objects.push(..._objects);
      objectChoices.push(
        ..._objects.map((obj) => objectToChoices(bucket.Name, obj))
      );
    }
  }

  if (todo !== "delete-buckets" && todo !== "create" && !objects && objects.length === 0) {
    log.error("No objects found");
    process.exit(1);
  }

  // todo
  switch (todo) {
    case "create":
      const name = await input({
        message: "Enter bucket name",
      });
      log.info(`Creating bucket ${name}`);
      try {
        await createBucket(name);
        log.success(`Created bucket ${name}`);
      } catch (error) {
        log.error(`Error creating bucket ${name}: ${error}`);
      }
      break;
    case "list":
      objects && printObjects(objects);
      break;
    case "download":
      // select all or specific objects
      const allOrSelected = await select({
        message: "Select all or specific objects to download",
        choices: allOrSelectedChoices,
      });

      let objectsToDownload = [];
      if (allOrSelected === "selected") {
        objectsToDownload = await checkbox({
          message: "Select objects to download",
          choices: objectChoices,
        });
        // check if objects selected are empty
        if (objectsToDownload.length === 0) {
          log.error("No objects selected");
          process.exit(1);
        }
      } else {
        // confirm download all objects
        const c = await confirm({
          message: `sure you want to download ${objects.length} objects from ${
            selectedBucket.length
          } buckets? (total: ${sizeToHumanReadable(totalSize(objects))})`,
        });
        if (!c) {
          log.error("Aborted");
          process.exit(1);
        }
        objectsToDownload = objectChoices.map((o) => o.value);
      }

      // loop over objects to download
      for (const obj of objectsToDownload) {
        try {
          // get object
          const object = await getObject(obj.bucket, obj.key);
          let keySplit = obj.key.split("/");
          keySplit.pop(); // id
          let fileName = keySplit.pop();
          // create directory
          await mkdir(keySplit.join("/"), { recursive: true });
          log.info(
            `Downloading ${fileName} from bucket ${obj.bucket} (${obj.size})`
          );
          // download object
          await new Promise((resolve, reject) => {
            object
              .pipe(createWriteStream([keySplit.join("/"), fileName].join("/")))
              .on("error", (err) => reject(err))
              .on("close", () => resolve())
              .on("finish", () => resolve());
          });
          log.success(`Downloaded ${fileName} from bucket ${obj.bucket}`);
        } catch (error) {
          log.error(`Error downloading ${obj.name} from bucket ${obj.bucket}`);
        }
      }
      break;
    case "delete-objects":
      // select all or specific objects
      const allOrSelectedDelete = await select({
        message: "Select all or specific objects to delete",
        choices: allOrSelectedChoices,
      });

      let objectsToDelete = [];
      if (allOrSelectedDelete === "selected") {
        objectsToDelete = await checkbox({
          message: "Select objects to delete",
          choices: objectChoices,
        });
        // check if objects selected are empty
        if (objectsToDelete.length === 0) {
          log.error("No objects selected");
          process.exit(1);
        }
      } else {
        const c = await confirm({
          message: `sure you want to delete ${objects.length} objects from ${
            selectedBucket.length
          } buckets? (free: ${sizeToHumanReadable(totalSize(objects))})`,
        });
        if (!c) {
          log.error("Aborted");
          process.exit(1);
        }
        objectsToDelete = objectChoices.map((o) => o.value);
      }

      // loop over objects to delete
      for (const obj of objectsToDelete) {
        log.info(`Deleting ${obj.key} from bucket ${obj.bucket} (${obj.size})`);
        try {
          await deleteObject(obj.bucket, obj.key);
          log.success(`Deleted ${obj.key} from bucket ${obj.bucket}`);
        } catch (error) {
          log.error(`Error deleting ${obj.key} from bucket ${obj.bucket}`);
        }
      }
      break;
    case "delete-buckets":
      const c = await confirm({
        message: `sure you want to delete ${selectedBucket.length} buckets?`,
      });
      if (!c) {
        log.error("Aborted");
        process.exit(1);
      }
      // loop over selected bucket
      for (const bucket of selectedBucket) {
        log.info(`Deleting bucket ${bucket.Name}`);
        try {
          await deleteEmptyBucket(bucket.Name);
          log.success(`Deleted bucket ${bucket.Name}`);
        } catch (error) {
          log.error(`Error deleting bucket ${bucket.Name}: ${error}`);
        }
      }
      break;
    default:
      log.error("Invalid choice");
      break;
  }
  const shouldRestart = await confirm({
    message: "Do you want to perform another action?",
  });

  if (shouldRestart) {
    await runCLI();
  } else {
    log.success("Thank you for using CloudFlare R2 CLI. Bye!");
    process.exit(0);
  }
};

program.version("1.0.0").description("CloudFlare R2 - CLI");

program.action(async () => {
  console.log(ascii("CloudFlare R2"));
  console.log(ascii("C L I"));
  runCLI();
});

program.parse(process.argv);
