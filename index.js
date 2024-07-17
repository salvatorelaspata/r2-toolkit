import { listBuckets, listObjects } from "./src/api.js";
import { manipolatedObjects, sizeToHumanReadable, totalSize } from "./src/util.js";

const buckets = await listBuckets();

buckets.forEach(bucket => {
  listObjects(bucket.Name).then(async objects => {
    console.log(`Bucket: ${bucket.Name}`);
    if(!objects || objects.length === 0) {
      console.log('No objects in bucket');
      return;
    }
    console.table(manipolatedObjects(objects));
    const size = totalSize(objects);
    console.log(`Total size: ${sizeToHumanReadable(size)}`);
  });
});