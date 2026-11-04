#!/usr/bin/env bash
# scripts/post-deploy-seo.sh - deploy er por live site e SEO smoke test (curl diye).
#
# Run:
#   bash scripts/post-deploy-seo.sh https://your-domain.com
#   SITE_URL=https://your-domain.com bash scripts/post-deploy-seo.sh
#
# Kono check fail korle exit code 1. Windows e Git Bash ba WSL e chalao.
set -u

SITE="${1:-${SITE_URL:-}}"
if [ -z "$SITE" ]; then
  echo "Usage: bash scripts/post-deploy-seo.sh https://your-domain.com"
  exit 2
fi
SITE="${SITE%/}"

# Local test er jonno http:// o cholbe, tokhon HTTPS redirect check skip hoy
case "$SITE" in
  https://*) IS_HTTPS=1 ;;
  http://*) IS_HTTPS=0 ;;
  *) echo "SITE must start with https:// (ba http:// local test er jonno)"; exit 2 ;;
esac

fail=0
CURL=(curl -s --max-time 20)

# ───────── helper ─────────
chk() { # chk "label" command args...
  local label=$1
  shift
  printf "%-46s" "$label"
  if "$@"; then echo "✓"; else echo "✗"; fail=1; fi
}
code() { "${CURL[@]}" -o /dev/null -w '%{http_code}' "$1"; }
status_is() { [ "$(code "$1")" = "$2" ]; }
is_redirect() { local c; c=$(code "$1"); [ "$c" = 301 ] || [ "$c" = 308 ]; } # Next.js 308 dey, tai duitoi thik
contains() { grep -qF -- "$2" <<<"$1"; }         # contains "$text" "needle"
matches() { grep -qiE -- "$2" <<<"$1"; }         # matches "$text" "regex" (case-insensitive)
not() { ! "$@"; }

# "User-agent: *" group e "Disallow: /" ache kina. (SemrushBot er Disallow: / ke ignore kore)
star_group_blocks_all() {
  awk '
    { line = tolower($0); sub(/\r$/, "", line) }
    line ~ /^user-agent:/ { star = (line ~ /^user-agent:[ \t]*\*[ \t]*$/) }
    star && line ~ /^disallow:[ \t]*\/[ \t]*$/ { found = 1 }
    END { exit !found }
  ' <<<"$ROBOTS"
}

# ───────── page gulo ekbar-i fetch ─────────
HOME_HTML=$("${CURL[@]}" "$SITE/")
HOME_HEADERS=$("${CURL[@]}" -I "$SITE/")
ROBOTS=$("${CURL[@]}" "$SITE/robots.txt")
SITEMAP=$("${CURL[@]}" "$SITE/sitemap.xml")

echo "SEO smoke test: $SITE"
echo

# ───────── 1) HTTPS ar redirect ─────────
chk "Home 200" status_is "$SITE/" 200
if [ "$IS_HTTPS" = 1 ]; then
  chk "HTTP -> HTTPS redirect (301/308)" is_redirect "${SITE/https:/http:}/"
fi

# ───────── 2) robots.txt ─────────
chk "robots.txt 200" status_is "$SITE/robots.txt" 200
chk "robots.txt: whole site not blocked" not star_group_blocks_all
chk "robots.txt has Sitemap line" matches "$ROBOTS" '^sitemap:'

# ───────── 3) sitemap ─────────
chk "sitemap.xml 200" status_is "$SITE/sitemap.xml" 200
chk "sitemap uses production URLs" contains "$SITEMAP" "<loc>$SITE/"
if ! matches "$SITE" 'localhost|127\.0\.0\.1'; then
  chk "sitemap has no localhost URL" not matches "$SITEMAP" 'localhost|127\.0\.0\.1'
fi
chk "sitemap lists template pages" matches "$SITEMAP" '<loc>[^<]*/templates/[^/<]+</loc>'
chk "/templates 200" status_is "$SITE/templates" 200

# ───────── 4) home page metadata ─────────
chk "title" matches "$HOME_HTML" '<title>[^<]+</title>'
chk "meta description" matches "$HOME_HTML" '<meta[^>]*name="description"'
chk "canonical exists" matches "$HOME_HTML" '<link[^>]*rel="canonical"'
chk "canonical points to this site" matches "$HOME_HTML" "<link[^>]*rel=\"canonical\"[^>]*href=\"$SITE"
chk "no noindex meta tag" not matches "$HOME_HTML" '<meta[^>]*name="(robots|googlebot)"[^>]*content="[^"]*noindex'
chk "no X-Robots-Tag noindex header" not matches "$HOME_HEADERS" '^x-robots-tag:.*noindex'
chk "og:image" matches "$HOME_HTML" '<meta[^>]*property="og:image"'
chk "JSON-LD" matches "$HOME_HTML" 'application/ld\+json'
if ! matches "$SITE" 'localhost|127\.0\.0\.1'; then
  chk "no localhost in HTML" not matches "$HOME_HTML" 'localhost:[0-9]+'
fi

# ───────── 5) file gulo ─────────
chk "manifest.webmanifest 200" status_is "$SITE/manifest.webmanifest" 200
chk "opengraph-image 200" status_is "$SITE/opengraph-image" 200

# ───────── 6) 404 thik kina (soft 404 noy) ─────────
chk "404 page returns real 404" status_is "$SITE/__nope__" 404

echo
if [ "$fail" = 0 ]; then
  echo "✓ Shob check pass"
else
  echo "✗ Kichu check fail korechhe"
fi
exit $fail
