export const todoQ = {
  message: "Choise an action",
  choices: [
  {
    name: "Create bucket",
    value: "create",
    description: "Create a new bucket",
  },
  {
    name: "List objects",
    value: "list",
    description: "List objects in bucket",
  },
  {
    name: "Download objects",
    value: "download",
    description: "Download objects from bucket",
  },
  {
    name: "Delete objects",
    value: "delete-objects",
    description: "Delete objects from bucket",
  },
  {
    name: "Delete empty buckets",
    value: "delete-buckets",
    description: "Delete only empty bucket",
  }
]}

export const bucketsQ = {
  message: "Seleziona un bucket",
  choices: (buckets) => {
    const all = { name: "ALL", value: "all", description: `All buckets (${buckets.map((b) => b.Name).join(', ')})` };
    const bucketChoices = buckets.map((bucket) => ({
      name: bucket.Name,
      value: bucket.Name,
      description: `Bucket: ${bucket.Name}`,
    }));

    if (buckets.length > 1) bucketChoices.unshift(all);
    return bucketChoices;
  },
}

export const allOrSelectedChoices =
  [
    {
      name: "All",
      value: "all",
      description: "Download all objects",
    },
    {
      name: "Selected",
      value: "selected",
      description: "Download specific objects",
    }
  ]
  