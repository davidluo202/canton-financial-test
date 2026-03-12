#!/usr/bin/env bash
set -euo pipefail

# Deploy to AWS Elastic Beanstalk
# Requirements:
#   - aws cli configured
#   - pnpm installed

APP_NAME="canton-financial"
ENV_NAME="Canton-financial-web"
S3_BUCKET="elasticbeanstalk-ap-southeast-1-971422711834"
REGION="ap-southeast-1"

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "${ROOT_DIR}"

echo "[1/4] Building project..."
pnpm -s install --frozen-lockfile=false
pnpm -s build

echo "[2/4] Packaging deployment bundle..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
VERSION_LABEL="v-${TIMESTAMP}"
ZIP_FILE="../canton-financial-aws-eb-deploy.zip"
S3_KEY="app-versions/${APP_NAME}/${VERSION_LABEL}.zip"

rm -f "$ZIP_FILE"
zip -q -r "$ZIP_FILE" dist/ drizzle/ package.json pnpm-lock.yaml Procfile -x "node_modules/*"

echo "[3/4] Uploading to S3..."
aws s3 cp "$ZIP_FILE" "s3://${S3_BUCKET}/${S3_KEY}" --region "${REGION}"

echo "[4/4] Deploying to Elastic Beanstalk..."
aws elasticbeanstalk create-application-version \
  --region "${REGION}" \
  --application-name "${APP_NAME}" \
  --version-label "${VERSION_LABEL}" \
  --source-bundle S3Bucket="${S3_BUCKET}",S3Key="${S3_KEY}"

aws elasticbeanstalk update-environment \
  --region "${REGION}" \
  --application-name "${APP_NAME}" \
  --environment-name "${ENV_NAME}" \
  --version-label "${VERSION_LABEL}"

echo "Deployment initiated!"
echo "Version: ${VERSION_LABEL}"
echo "It will take a few minutes for the Elastic Beanstalk environment to update."
