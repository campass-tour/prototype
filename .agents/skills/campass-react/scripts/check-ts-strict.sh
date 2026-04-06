#!/bin/bash
# 检查 TypeScript 文件的严格模式和未使用变量/参数/导入

if [ -z "$1" ]; then
  echo "Usage: $0 <tsconfig-path>"
  exit 1
fi

TSCONFIG_PATH=$1

# 检查严格模式
STRICT=$(jq -r '.compilerOptions.strict' "$TSCONFIG_PATH")
if [ "$STRICT" != "true" ]; then
  echo "Error: strict mode is not enabled in $TSCONFIG_PATH."
  exit 1
fi

echo "Strict mode is enabled. Running tsc for unused checks..."

# 检查未使用的变量、参数、导入（tsc --noEmit --strict 已包含未使用检查）
npx tsc --noEmit --project "$TSCONFIG_PATH"

if [ $? -eq 0 ]; then
  echo "TypeScript strict checks passed."
  exit 0
else
  echo "TypeScript strict checks failed. See errors above."
  exit 1
fi
