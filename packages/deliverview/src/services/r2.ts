export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  data: ReadableStream | ArrayBuffer | string,
  contentType: string
): Promise<R2Object> {
  return bucket.put(key, data, {
    httpMetadata: { contentType },
  });
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

export async function getFromR2(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return bucket.get(key);
}

export async function getSignedUrl(bucket: R2Bucket, key: string): Promise<string | null> {
  const obj = await bucket.get(key);
  if (!obj) return null;
  // For public R2 buckets, construct the URL directly
  // For private buckets, use presigned URLs via R2 API
  return key;
}
