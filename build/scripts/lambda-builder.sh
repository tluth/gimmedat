#!/usr/bin/env bash
set -euo pipefail

LAMBDA_NAME=$1
SRC_DIR=$2
REQS_FILE=$3

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUILD_DIR="$REPO_ROOT/build/$LAMBDA_NAME"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install dependencies in Docker
docker run --rm \
  -v "$REPO_ROOT":/var/task \
  -w /var/task \
  --user "$(id -u):$(id -g)" \
  --entrypoint /bin/bash \
  lambda-builder:3.12 \
  -c "pip install -r $REQS_FILE --target /var/task/build/$LAMBDA_NAME --only-binary=:all:"

rsync -av --exclude='__pycache__' --exclude='*.pyc' "$SRC_DIR" "$BUILD_DIR/"

cd "$BUILD_DIR"
zip -r "../$LAMBDA_NAME.zip" .

echo "Built artifact: build/$LAMBDA_NAME.zip"
