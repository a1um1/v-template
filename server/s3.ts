import * as Minio from "minio";

const endpoint_url = new URL(Bun.env.BUCKET_ENDPOINT || "http://localhost:3900");
const minioClient = new Minio.Client({
  endPoint: endpoint_url.hostname,
  port: Number(endpoint_url.port) || 3900,
  region: Bun.env.BUCKET_REGION || "garage",
  useSSL: endpoint_url.protocol === "https:",
  accessKey: Bun.env.BUCKET_KEY || "",
  secretKey: Bun.env.BUCKET_SECRET || "",
});

export { minioClient };
