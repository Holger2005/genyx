#!/usr/bin/env bash
set -euo pipefail

export CHROME_PATH="${CHROME_PATH:-/usr/bin/google-chrome}"
export NEXT_TELEMETRY_DISABLED=1
origin=http://127.0.0.1:3191
out=.artifacts/lighthouse
mkdir -p "$out"

node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3191 > "$out/server.log" 2>&1 &
server=$!
trap 'kill "$server" 2>/dev/null || true' EXIT

ready=0
for attempt in {1..60}; do
  if curl --fail --silent "$origin/es" > /dev/null; then
    ready=1
    break
  fi
  kill -0 "$server"
  sleep 1
done
test "$ready" -eq 1

audit() {
  local name="$1" route="$2"
  shift 2
  npm exec --yes --package=lighthouse@13.6.0 -- lighthouse "$origin/$route" \
    --quiet --output=json --output-path="$out/$name.json" \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless --disable-dev-shm-usage" "$@"
}

for locale in es en; do
  for sample in 1 2 3; do
    audit "$locale-home-mobile-$sample" "$locale"
  done
  audit "$locale-home-desktop" "$locale" --preset=desktop
  audit "$locale-projects-mobile" "$locale/projects"
  audit "$locale-case-mobile" "$locale/projects/genyx"
  audit "$locale-services-mobile" "$locale/services"
  audit "$locale-products-mobile" "$locale/products"
  audit "$locale-inquiry-mobile" "$locale/inquiry"
  audit "$locale-consultation-mobile" "$locale/consultation"
  audit "$locale-privacy-mobile" "$locale/privacy"
done

npm run test:lighthouse
