#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_ROOT="${GUARDS_RUN_MAIN_DIR:-${REPO_ROOT%/*}/anaconda-run-main}"
PORT="${GUARDS_DEV_PORT:-3000}"
LOG_DIR="$RUN_ROOT/.codex"
LOG_FILE="$LOG_DIR/dev-main.log"

mkdir -p "$LOG_DIR"

git -C "$REPO_ROOT" fetch origin main

if [[ ! -e "$RUN_ROOT/.git" ]]; then
  git -C "$REPO_ROOT" worktree add -f "$RUN_ROOT" origin/main
fi

git -C "$RUN_ROOT" fetch origin main
git -C "$RUN_ROOT" reset --hard origin/main

if [[ "$REPO_ROOT" != "$RUN_ROOT" && -f "$REPO_ROOT/.env" ]]; then
  cp "$REPO_ROOT/.env" "$RUN_ROOT/.env"
fi

if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  lsof -tiTCP:"$PORT" -sTCP:LISTEN | xargs kill -9
  sleep 1
fi

(
  cd "$RUN_ROOT"
  pnpm install >/dev/null
  nohup pnpm --dir apps/ui dev --port "$PORT" >"$LOG_FILE" 2>&1 &
  echo $! > "$LOG_DIR/dev-main.pid"
)

echo "main refreshed at $(git -C "$RUN_ROOT" rev-parse --short HEAD)"
echo "dev server: http://localhost:$PORT"
echo "log file: $LOG_FILE"
