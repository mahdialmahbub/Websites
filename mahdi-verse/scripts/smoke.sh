#!/usr/bin/env bash
# Production smoke test for the portfolio site.
# Usage: bash scripts/smoke.sh https://mahdi-verse.vercel.app/
#        INDEXNOW_KEY=yourkey bash scripts/smoke.sh https://mahdi-verse.vercel.app/   (also checks the IndexNow key file)
set -u

SITE="${1:-https://mahdi-verse.vercel.app/}"
SITE="${SITE%/}"

case "$SITE" in
  https://*) ;;
  *) echo "Use the production https:// URL, for example: bash $0 https://mahdi-verse.vercel.app/"; exit 2 ;;
esac

fail=0

# ---------- helpers ----------
fetch()          { curl -s --max-time 15 "$@"; }
code()           { fetch -o /dev/null -w '%{http_code}' "$1"; }
is_code()        { [ "$(code "$2")" = "$1" ]; }               # is_code 200 URL
is_redirect()    { [[ "$(code "$1")" =~ ^(301|308)$ ]]; }     # hosts use 301 or 308 for permanent redirects
contains()       { grep -qF -- "$2" <<<"$1"; }                # contains "$text" "fixed string"
matches()        { grep -qiE -- "$2" <<<"$1"; }              # matches "$text" "regex"
absent()         { ! grep -qiE -- "$2" <<<"$1"; }           # absent "$text" "regex"
og_image_url()   { grep -oE '<meta property="og:image" content="[^"]+"' <<<"$1" | head -1 | sed -E 's/.*content="([^"]+)"/\1/; s/&amp;/\&/g'; }
loads_as_image() { [[ "$(fetch -o /dev/null -w '%{http_code} %{content_type}' "$1")" == "200 image/"* ]]; }

chk() { printf '%-46s' "$1"; shift; if "$@"; then echo "✓"; else echo "✗"; fail=1; fi; }

# ---------- derived values ----------
HTTP_URL="${SITE/https:/http:}/"
HOST="${SITE#https://}"
if [[ "$HOST" == www.* ]]; then OTHER_HOST="${HOST#www.}"; else OTHER_HOST="www.$HOST"; fi

echo "Checking $SITE"

# ---------- server ----------
echo; echo "Server"
chk "HTTPS home page 200"              is_code 200 "$SITE/"
chk "HTTP -> HTTPS permanent redirect" is_redirect "$HTTP_URL"
# Delete the next line if you do not use a www / non-www variant of your domain
chk "www/non-www permanent redirect"   is_redirect "https://$OTHER_HOST/"
chk "unknown URL returns 404"          is_code 404 "$SITE/__nope__"
chk "manifest 200"                     is_code 200 "$SITE/manifest.webmanifest"

# ---------- robots.txt ----------
echo; echo "robots.txt"
ROBOTS="$(fetch "$SITE/robots.txt")"
chk "robots.txt 200"                   is_code 200 "$SITE/robots.txt"
chk "site is not fully blocked"        absent "$ROBOTS" '^Disallow:[[:space:]]*/[[:space:]]*$'
chk "lists the sitemap"                contains "$ROBOTS" "Sitemap: $SITE/sitemap.xml"

# ---------- sitemap.xml ----------
echo; echo "sitemap.xml"
SITEMAP="$(fetch "$SITE/sitemap.xml")"
chk "sitemap.xml 200"                  is_code 200 "$SITE/sitemap.xml"
chk "sitemap uses the production URL"  contains "$SITEMAP" "<loc>$SITE/"
chk "sitemap has no localhost URL"     absent "$SITEMAP" 'localhost|127\.0\.0\.1'
chk "sitemap lists project pages"      contains "$SITEMAP" "<loc>$SITE/projects/"

# ---------- home page ----------
echo; echo "Home page"
HOME_HTML="$(fetch "$SITE/")"
chk "<html lang> set"                  matches "$HOME_HTML" '<html[^>]*lang="[a-z-]+"'
chk "<title> present"                  matches "$HOME_HTML" '<title>[^<]+</title>'
chk "meta description present"         matches "$HOME_HTML" '<meta name="description" content="[^"]+"'
chk "canonical = home URL"             contains "$HOME_HTML" "<link rel=\"canonical\" href=\"$SITE/\""
chk "not noindex"                      absent "$HOME_HTML" '<meta name="robots" content="[^"]*noindex'
chk "JSON-LD present"                  contains "$HOME_HTML" 'application/ld+json'
chk "og:image loads"                   loads_as_image "$(og_image_url "$HOME_HTML")"

# ---------- first project page from the sitemap ----------
echo; echo "First project page"
PROJECT_URL="$(grep -oE '<loc>[^<]*/projects/[^<]+</loc>' <<<"$SITEMAP" | head -1 | sed -E 's#</?loc>##g')"
if [ -n "$PROJECT_URL" ]; then
  echo "($PROJECT_URL)"
  PROJECT_HTML="$(fetch "$PROJECT_URL")"
  chk "project page 200"               is_code 200 "$PROJECT_URL"
  chk "<title> present"                matches "$PROJECT_HTML" '<title>[^<]+</title>'
  chk "canonical = own URL"            contains "$PROJECT_HTML" "<link rel=\"canonical\" href=\"$PROJECT_URL\""
  chk "not noindex"                    absent "$PROJECT_HTML" '<meta name="robots" content="[^"]*noindex'
  chk "JSON-LD present"                contains "$PROJECT_HTML" 'application/ld+json'
  chk "og:image loads"                 loads_as_image "$(og_image_url "$PROJECT_HTML")"
else
  echo "No /projects/ URL found in the sitemap, skipped"
fi

# ---------- IndexNow key file (only when INDEXNOW_KEY is set) ----------
if [ -n "${INDEXNOW_KEY:-}" ]; then
  echo; echo "IndexNow"
  chk "IndexNow key file matches the key" test "$(fetch "$SITE/$INDEXNOW_KEY.txt")" = "$INDEXNOW_KEY"
fi

echo
if [ "$fail" -eq 0 ]; then echo "All checks passed"; else echo "Some checks failed (see ✗ above)"; fi
exit "$fail"