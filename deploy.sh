#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-web@199.247.17.105}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/daybook/}"
DRY_RUN=false
ASSUME_YES=false

usage() {
  printf 'Usage: %s [--dry-run] [--yes]\n' "$(basename "$0")"
  printf '  --dry-run  Show which files would change without uploading them\n'
  printf '  --yes      Skip the deployment confirmation prompt\n'
}

while (($#)); do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      ;;
    --yes)
      ASSUME_YES=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown option: %s\n' "$1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

cd "$PROJECT_DIR"

printf 'Deploy Daybook to %s:%s\n' "$DEPLOY_HOST" "$DEPLOY_PATH"
if [[ "$DRY_RUN" == true ]]; then
  printf 'Mode: dry run\n'
fi

if [[ "$ASSUME_YES" != true ]]; then
  read -r -p 'Continue? [y/N] ' reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    printf 'Deployment cancelled.\n'
    exit 0
  fi
fi

npm run lint
npm run build

rsync_args=(-az --delete --itemize-changes)
if [[ "$DRY_RUN" == true ]]; then
  rsync_args+=(--dry-run)
fi

rsync "${rsync_args[@]}" dist/ "$DEPLOY_HOST:$DEPLOY_PATH"

if [[ "$DRY_RUN" == true ]]; then
  printf 'Dry run complete; no files were uploaded.\n'
else
  printf 'Deployment complete: https://daybook.federicomoretti.dev\n'
fi
