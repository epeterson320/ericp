resource "github_repository" "blog" {
  name = "blog"
  description = "My personal blog"
  has_issues = true
}

resource "netlify_site" "blog" {
  name = "ericp"
  custom_domain = "www.ericp.co"

  repo {
    command = "gatsby build"
    dir = "public"
    provider = "github"
    repo_path = "epeterson320/blog"
    repo_branch = "master"
  }
}

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

resource "github_repository" "codeck" {
  name = "codeck"
  description = "Arrange a deck of cards to encode a secret message."
  homepage_url = "https://codeck.ericp.co"
  has_issues = true
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
  value   = "${netlify_site.codeck.name}.netlify.com"
  type    = "CNAME"
  proxied = true
}

resource "github_repository" "crazytown" {
  name = "crazytown"
  has_issues = true
}

resource "netlify_site" "crazytown" {
  name = "eager-davinci-7a1f6f"
  custom_domain = "crazytown.ericp.co"

  repo {
    command = "yarn build"
    dir = "build"
    provider = "github"
    repo_path = "epeterson320/crazytown"
    repo_branch = "main"
  }
}
resource "cloudflare_record" "crazytown" {
  zone_id = cloudflare_zone.ericp.id
  name    = "crazytown"
  value   = "eager-davinci-7a1f6f.netlify.app"
  type    = "CNAME"
  proxied = true
}

resource "github_repository" "triangle_calculator" {
  name = "triangle-calculator"
  description = "Web app that solves triangles with trigonometry."
  homepage_url = "https://triangle-calculator.ericp.co"
  has_issues = true
}

resource "netlify_site" "triangle_calculator" {
  name = "stoic-cray-54e6f3"
  custom_domain = "triangle-calculator.ericp.co"

  repo {
    command = "yarn build"
    dir = "build"
    provider = "github"
    repo_path = "epeterson320/triangle-calculator"
    repo_branch = "master"
  }
}

resource "cloudflare_record" "triangle_calculator" {
  zone_id = cloudflare_zone.ericp.id
  name    = "triangle-calculator"
  value   = "stoic-cray-54e6f3.netlify.com"
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