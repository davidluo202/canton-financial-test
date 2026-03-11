<#
.SYNOPSIS
Deploy Vite static build (dist/public) to AWS S3 and optionally create a CloudFront invalidation.

.DESCRIPTION
This script builds the frontend and uses the AWS CLI to sync files to S3.
It sets long cache headers for assets and no-cache for index.html.

.EXAMPLE
$env:AWS_S3_BUCKET="971422711834-cmf-web-ap-southeast-1"
$env:AWS_REGION="ap-southeast-1"
$env:CLOUDFRONT_DISTRIBUTION_ID="E2HW0Z0EMV4CYE"
.\scripts\deploy-aws-static.ps1
#>

$ErrorActionPreference = "Stop"

$bucket = $env:AWS_S3_BUCKET
$region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$cfDistId = $env:CLOUDFRONT_DISTRIBUTION_ID

if (-not $bucket) {
    Write-Error "AWS_S3_BUCKET environment variable is required."
    exit 1
}

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

Write-Host "[1/3] Build frontend..." -ForegroundColor Cyan
# Run pnpm via cmd to avoid PowerShell execution policy issues with npm wrappers
cmd.exe /c "pnpm -s install --frozen-lockfile=false"
cmd.exe /c "pnpm -s build"

$publicDir = Join-Path $rootDir "dist\public"
if (-not (Test-Path $publicDir)) {
    Write-Error "dist\public not found after build."
    exit 1
}

Write-Host "[2/3] Upload to s3://${bucket}/ ..." -ForegroundColor Cyan

# Sync all files except index.html with long cache
aws s3 sync "$publicDir" "s3://${bucket}/" `
    --region "$region" `
    --delete `
    --exclude "index.html" `
    --cache-control "public,max-age=31536000,immutable"

# Copy index.html with no-cache
aws s3 cp "$publicDir\index.html" "s3://${bucket}/index.html" `
    --region "$region" `
    --cache-control "no-cache"

Write-Host "[3/3] CloudFront invalidation (optional)..." -ForegroundColor Cyan
if ($cfDistId) {
    aws cloudfront create-invalidation `
        --distribution-id "$cfDistId" `
        --paths "/index.html" "/" | Out-Null
    Write-Host "CloudFront invalidation created for Distribution: $cfDistId" -ForegroundColor Green
} else {
    Write-Host "Skip (CLOUDFRONT_DISTRIBUTION_ID not set)" -ForegroundColor Yellow
}

Write-Host "Done!" -ForegroundColor Green
