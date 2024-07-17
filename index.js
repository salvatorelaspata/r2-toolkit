import { listBuckets, listObjects } from "./src/api.js";

const buckets = await listBuckets();

buckets.forEach(bucket => {
  listObjects(bucket.Name).then(async objects => {
    console.log(`Bucket: ${bucket.Name}`);
    if(!objects || objects.length === 0) {
      console.log('No objects in bucket');
      return;
    }
    const manipolatedObjects = objects.map(obj => ({
      Key: obj.Key, 
      LastModified: obj.LastModified,
      sizeHumanReadable: obj.Size < 1024 ? `${obj.Size} bytes` : obj.Size < 1024 * 1024 ? `${(obj.Size / 1024).toFixed(2)} KB` : `${(obj.Size / 1024 / 1024).toFixed(2)} MB`
    }))
    console.table(manipolatedObjects);

    const size = objects.reduce((acc, obj) => acc + obj.Size, 0);
    // show total size in human readable format (bytes, KB, MB, GB)
    const sizeHumanReadable = `${size} bytes; ${(size / 1024).toFixed(2)} KB; ${(size / 1024 / 1024).toFixed(2)} MB; ${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
    console.log(`Total size: ${sizeHumanReadable}`);
  });
});