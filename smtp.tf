resource "cloudflare_record" "smtp" {
  zone_id  = cloudflare_zone.ericp.id
  name     = "ericp.co"
  value    = "gmr-smtp-in.l.google.com"
  type     = "MX"
  priority = 5
}

resource "cloudflare_record" "smtp_alt1" {
  zone_id  = cloudflare_zone.ericp.id
  name     = "ericp.co"
  value    = "alt1.gmr-smtp-in.l.google.com"
  type     = "MX"
  priority = 10
}

resource "cloudflare_record" "smtp_alt2" {
  zone_id  = cloudflare_zone.ericp.id
  name     = "ericp.co"
  value    = "alt2.gmr-smtp-in.l.google.com"
  type     = "MX"
  priority = 20
}

resource "cloudflare_record" "smtp_alt3" {
  zone_id  = cloudflare_zone.ericp.id
  name     = "ericp.co"
  value    = "alt3.gmr-smtp-in.l.google.com"
  type     = "MX"
  priority = 30
}

resource "cloudflare_record" "smtp_alt4" {
  zone_id  = cloudflare_zone.ericp.id
  name     = "ericp.co"
  value    = "alt4.gmr-smtp-in.l.google.com"
  type     = "MX"
  priority = 40
}