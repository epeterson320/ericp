module "blog" {
  source = "./modules/static-site"

  hostname            = "www.ericp.co"
  description         = "My personal blog"
  repo_name           = "blog"
  netlify_unique_name = "ericp"
  build_cmd           = "gatsby build"
  publish_dir         = "public"
}

resource "cloudflare_record" "domain_root" {
  zone_id = cloudflare_zone.ericp.id
  name    = "@"
  value   = module.blog.resolved_hostname
  type    = "CNAME"
  proxied = true
}

module "codeck" {
  source = "./modules/static-site"

  hostname            = "codeck.ericp.co"
  description         = "Arrange a deck of cards to encode a secret message."
  repo_name           = "codeck"
  netlify_unique_name = "ericp-codeck"
  build_cmd           = "yarn build"
  publish_dir         = "dist"
}
module "crazytown" {
  source = "./modules/static-site"

  hostname            = "crazytown.ericp.co"
  description         = "Hopefully a game one day"
  repo_name           = "codeck"
  netlify_unique_name = "eager-davinci-7a1f6f"
  build_cmd           = "yarn build"
  publish_dir         = "build"
}
module "triangles" {
  source = "./modules/static-site"

  hostname            = "triangle-calculator.ericp.co"
  description         = "Web app that solves triangles with trigonometry."
  repo_name           = "triangle-calculator"
  netlify_unique_name = "triangle-calculator"
  build_cmd           = "yarn build"
  publish_dir         = "build"
}

module "kqp33" {
  source = "./modules/static-site"

  hostname            = "kqp33.ericp.co"
  netlify_unique_name = "kqp33"
  publish_dir         = "kqp33"
}

module "namemypub" {
  source = "./modules/static-site"

  hostname            = "namemypub.ericp.co"
  netlify_unique_name = "namemypub"
  publish_dir         = "namemypub"
}
