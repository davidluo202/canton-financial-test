<#
.SYNOPSIS
Deploy Canton Financial Web to AWS Elastic Beanstalk.

.DESCRIPTION
This script builds the project, creates a deployment zip, uploads it to S3, and triggers an Elastic Beanstalk deployment.
#>

$ErrorActionPreference = "Stop"

$AppName = "canton-financial"
$EnvName = "Canton-financial-web"
$S3Bucket = "elasticbeanstalk-ap-southeast-1-971422711834"
$Region = "ap-southeast-1"

$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RootDir

Write-Host "[1/4] Building project..." -ForegroundColor Cyan
cmd.exe /c "pnpm -s install --frozen-lockfile=false"
cmd.exe /c "pnpm -s build"

Write-Host "[2/4] Packaging deployment bundle..." -ForegroundColor Cyan
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$VersionLabel = "v-$Timestamp"
$ZipFile = "..\canton-financial-aws-eb-deploy.zip"
$S3Key = "app-versions/$AppName/$VersionLabel.zip"

if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }

# Requires 7-Zip or PowerShell 5+ Compress-Archive
Compress-Archive -Path "dist", "drizzle", "package.json", "pnpm-lock.yaml", "Procfile" -DestinationPath $ZipFile -Force

Write-Host "[3/4] Uploading to S3..." -ForegroundColor Cyan
aws s3 cp "$ZipFile" "s3://${S3Bucket}/${S3Key}" --region "$Region"

Write-Host "[4/4] Deploying to Elastic Beanstalk..." -ForegroundColor Cyan
aws elasticbeanstalk create-application-version `
    --region "$Region" `
    --application-name "$AppName" `
    --version-label "$VersionLabel" `
    --source-bundle S3Bucket="$S3Bucket",S3Key="$S3Key" | Out-Null

aws elasticbeanstalk update-environment `
    --region "$Region" `
    --application-name "$AppName" `
    --environment-name "$EnvName" `
    --version-label "$VersionLabel" | Out-Null

Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host "Version: $VersionLabel"
Write-Host "It will take a few minutes for the Elastic Beanstalk environment to update."
