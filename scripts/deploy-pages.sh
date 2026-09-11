#!/usr/bin/env bash
#
# Deploy bản build lên nhánh gh-pages.
#
# Viết thành script vì làm tay rất dễ sai: có lần `git checkout --orphan` thất
# bại do nhánh đã tồn tại, lệnh push sau đó đẩy ref cũ và tưởng là đã xong.
# Script này kiểm tra từng bước và dừng ngay khi có gì không đúng.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="${TMPDIR:-/tmp}/vhuman-gh-pages"
BRANCH="gh-pages"

cd "$REPO_ROOT"

echo "==> Build"
npm run build

echo "==> Chuẩn bị dist"
touch dist/.nojekyll
# HashRouter không cần, nhưng phòng khi ai đó gõ thẳng một đường dẫn.
cp dist/index.html dist/404.html

# Bản build phải trỏ tới asset đã đóng gói, không được trỏ /src/main.tsx.
if grep -q 'src/main.tsx' dist/index.html; then
  echo "LỖI: dist/index.html vẫn trỏ tới src/main.tsx, đây là file nguồn chứ không phải bản build." >&2
  exit 1
fi
if ! grep -qE 'assets/index-.*\.js' dist/index.html; then
  echo "LỖI: dist/index.html không tham chiếu bundle nào." >&2
  exit 1
fi

echo "==> Cập nhật nhánh $BRANCH"
git worktree prune
rm -rf "$WORKTREE"
git fetch -q origin "$BRANCH" 2>/dev/null || true

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add -q "$WORKTREE" "$BRANCH"
  git -C "$WORKTREE" reset -q --hard "origin/$BRANCH" 2>/dev/null || true
else
  git worktree add -q --detach "$WORKTREE"
  git -C "$WORKTREE" checkout -q --orphan "$BRANCH"
fi

find "$WORKTREE" -maxdepth 1 ! -name "$(basename "$WORKTREE")" ! -name .git -exec rm -rf {} + 2>/dev/null || true
cp -R dist/. "$WORKTREE"/

BEFORE="$(git -C "$WORKTREE" rev-parse HEAD 2>/dev/null || echo none)"
git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "    Không có thay đổi so với bản đang live."
else
  git -C "$WORKTREE" commit -q -m "deploy: ${1:-cập nhật bản build}"
  git -C "$WORKTREE" push -q origin "$BRANCH"
  AFTER="$(git -C "$WORKTREE" rev-parse HEAD)"
  echo "    $BEFORE -> ${AFTER:0:7}"
fi

git worktree remove --force "$WORKTREE"

echo "==> Yêu cầu GitHub build lại"
gh api -X POST "repos/ndducnha/vhuman/pages/builds" --jq '.status' >/dev/null

for i in $(seq 1 18); do
  sleep 10
  STATUS="$(gh api repos/ndducnha/vhuman/pages/builds/latest --jq '.status' 2>/dev/null || echo '?')"
  echo "    lần $i: $STATUS"
  [ "$STATUS" = "built" ] && break
done

echo "==> Kiểm tra trang live"
URL="https://ndducnha.github.io/vhuman/"
CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$URL?cb=$RANDOM")"
echo "    HTTP $CODE"
[ "$CODE" = "200" ] || { echo "LỖI: trang live không trả về 200." >&2; exit 1; }

echo "Xong: $URL"
