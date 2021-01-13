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

resource "cloudflare_record" "domain_root" {
  zone_id = cloudflare_zone.ericp.id
  name    = "@"
  value   = "${netlify_site.blog.name}.netlify.app"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.ericp.id
  name    = "www"
  value   = "${netlify_site.blog.name}.netlify.app"
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
  name = "ericp-codeck"
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
  value   = "${netlify_site.codeck.name}.netlify.app"
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
  name = "triangle-calculator"
  custom_domain = "triangle-calculator.ericp.co"

  repo {
    command = "yarn build"
    dir = "build"
    provider = "github"
    repo_path = github_repository.triangle_calculator.full_name
    repo_branch = "master"
  }
}

resource "cloudflare_record" "triangle_calculator" {
  zone_id = cloudflare_zone.ericp.id
  name    = "triangle-calculator"
  value   = "${netlify_site.triangle_calculator.name}.netlify.app"
  type    = "CNAME"
  proxied = true
}

resource "github_repository" "ericp" {
  name = "ericp"
  description = "Infrastructure and sites at ericp.co"
  has_issues = true
}

resource "netlify_site" "kqp33" {
  name = "kqp33"
  custom_domain = "kqp33.ericp.co"

  repo {
    dir = "kqp33"
    provider = "github"
    repo_path = github_repository.ericp.full_name
    repo_branch = github_repository.ericp.default_branch
  }
}

resource "cloudflare_record" "kqp33" {
  zone_id = cloudflare_zone.ericp.id
  name    = "kqp33"
  value   = "kqp33.netlify.app"
  type    = "CNAME"
  proxied = true
}

resource "netlify_site" "namemypub" {
  name = "namemypub"
  custom_domain = "namemypub.ericp.co"

  repo {
    dir = "namemypub"
    provider = "github"
    repo_path = github_repository.ericp.full_name
    repo_branch = github_repository.ericp.default_branch
  }
}

resource "cloudflare_record" "namemypub" {
  zone_id = cloudflare_zone.ericp.id
  name    = "namemypub"
  value   = "${netlify_site.namemypub.name}.netlify.app"
  type    = "CNAME"
  proxied = true
}
