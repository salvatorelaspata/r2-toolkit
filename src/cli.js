import { checkbox, select } from '@inquirer/prompts';
import { HelloAscii } from './helloAscii.js';
import { listBuckets, listObjects } from './api.js';
import { manipolatedObjects, printObjects, sizeToHumanReadable } from './util.js';

console.log(HelloAscii);

const buckets = await listBuckets();

if(!buckets || buckets.length === 0) {
  console.log('No buckets found');
  process.exit(1);
}

const all = { name: 'All', value: 'all', description: 'All buckets' };
const bucketChoices = buckets.map(bucket => ({ name: bucket.Name, value: bucket.Name, description: `${bucket.Name}` }));
if (buckets.length > 1) bucketChoices.unshift(all);

const bucketName = await select({
  message: 'Seleziona un bucket',
  choices: bucketChoices
});

let selectedBucket = [];
if(bucketName === 'all') {
  console.log('Selected all buckets');
  selectedBucket = buckets;
} else {
  console.log(`Selected bucket: ${bucketName}`);
  const selected = buckets.find(bucket => bucket.Name === bucketName);
  selectedBucket.push(selected);
}

// todo
const todoChoices = [
  { name: 'List objects', value: 'list' },
  { name: 'Download objects', value: 'download' },
  { name: 'Delete objects', value: 'delete' }
];

const todo = await select({
  message: 'Seleziona un bucket',
  choices: todoChoices
});

if(todo === 'list') {
  for (const bucket of selectedBucket) {
    console.log(`Bucket: ${bucket.Name}`);
    const objects = await listObjects(bucket.Name);
    if(!objects || objects.length === 0) {
      console.log(`No objects in bucket ${bucket.Name}`);
      continue;
    }
    printObjects(objects);
  }
} else if(todo === 'download') {
  const downloadChoise = []
  
  for (const bucket of selectedBucket) {
    const objects = await listObjects(bucket.Name) || [];
    const name = selectedBucket.length > 1 ? `${bucket.Name}` : '';
    objects.map(obj => downloadChoise.push({ name: `[${name}] ${obj.Key}`, value: obj.Key, description: obj.Key }));
  }

  const objectsToDownload = await checkbox({
    message: 'Select objects to download',
    choices: downloadChoise
  });

  if(objectsToDownload.length === 0) {
    console.log('No objects selected');
    process.exit(1);
  }

  for (const bucket of selectedBucket) {
    for (const obj of objectsToDownload) {
      console.log(`Downloading ${obj} from bucket ${bucket.Name}`);
    }
  }
} else if(todo === 'delete') {
  console.log('Delete');
}