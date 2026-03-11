#!/usr/bin/env bash
set -euo pipefail

# Deploy Vite static build (dist/public) to AWS S3 + (optional) CloudFront invalidation
#
# Requirements:
#   - aws cli configured (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or profile)
#   - bucket exists and is configured for static website hosting OR behind CloudFront
#
# Usage:
#   AWS_S3_BUCKET=cmf-website-bucket \
#   AWS_REGION=ap-east-1 \
#   CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC \
#   ./scripts/deploy-aws-static.sh

AWS_S3_BUCKET=${AWS_S3_BUCKET:-}
AWS_REGION=${AWS_REGION:-us-east-1}
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-}

if [[ -z "${AWS_S3_BUCKET}" ]]; then
  echo "ERROR: AWS_S3_BUCKET is required" >&2
  exit 1
fi

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

echo "[1/3] Build frontend"
cd "${ROOT_DIR}"
pnpm -s install --frozen-lockfile=false
pnpm -s build

if [[ ! -d "${ROOT_DIR}/dist/public" ]]; then
  echo "ERROR: dist/public not found after build" >&2
  exit 1
fi

echo "[2/3] Upload to s3://${AWS_S3_BUCKET}/"
# Cache policy:
# - assets/*: long cache (immutable)
# - index.html + root files: no-cache

aws s3 sync "${ROOT_DIR}/dist/public" "s3://${AWS_S3_BUCKET}/" \
  --region "${AWS_REGION}" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp "${ROOT_DIR}/dist/public/index.html" "s3://${AWS_S3_BUCKET}/index.html" \
  --region "${AWS_REGION}" \
  --cache-control "no-cache"

echo "[3/3] CloudFront invalidation (optional)"
if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID}" ]]; then
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/index.html" "/" \
    >/dev/null
  echo "CloudFront invalidation created: ${CLOUDFRONT_DISTRIBUTION_ID}"
else
  echo "Skip (CLOUDFRONT_DISTRIBUTION_ID not set)"
fi

echo "Done."
