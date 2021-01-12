resource "cloudflare_record" "a" {
  zone_id = cloudflare_zone.ericp.id
  name    = "ericp.co"
  value   = "104.198.14.52"
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.ericp.id
  name    = "www"
  value   = "ericp.netlify.com"
  type    = "CNAME"
  proxied = true
}

resource "netlify_site" "codeck" {
  name = "infallible-liskov-79ba9c"
  custom_domain = "codeck.ericp.co"

  repo {
    command = "yarn build"
    dir = "dist"
    provider = "github"
    repo_path = "epeterson320/codeck"
    repo_branch = "master"
  }
}

resource "cloudflare_record" "codeck" {
  zone_id = cloudflare_zone.ericp.id
  name    = "codeck"
  value   = "infallible-liskov-79ba9c.netlify.com"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "crazytown" {
  zone_id = cloudflare_zone.ericp.id
  name    = "crazytown"
  value   = "eager-davinci-7a1f6f.netlify.app"
  type    = "CNAME"
  proxied = true
}
resource "cloudflare_record" "kqp33" {
  zone_id = cloudflare_zone.ericp.id
  name    = "kqp33"
  value   = "kqp33.netlify.app"
  type    = "CNAME"
  proxied = true
}
resource "cloudflare_record" "namemypub" {
  zone_id = cloudflare_zone.ericp.id
  name    = "namemypub"
  value   = "elastic-bassi-1e2f82.netlify.com"
  type    = "CNAME"
  proxied = true
}
resource "cloudflare_record" "triangle_calculator" {
  zone_id = cloudflare_zone.ericp.id
  name    = "triangle-calculator"
  value   = "stoic-cray-54e6f3.netlify.com"
  type    = "CNAME"
  proxied = true
}

/* Nice to have module like:

static-site site-name {
  repo String = thisrepo
  baseDir String = ./
  domain String = ericp.co
  subdomain String required
  buildCmd String = yarn build
  publishDir = baseDir
}

*/