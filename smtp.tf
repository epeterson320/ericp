resource "cloudflare_record" "smtp" {
  for_each = {
    main = ["gmr-smtp-in.l.google.com", 5]
    alt1 = ["alt1.gmr-smtp-in.l.google.com", 10]
    alt2 = ["alt2.gmr-smtp-in.l.google.com", 20]
    alt3 = ["alt3.gmr-smtp-in.l.google.com", 30]
    alt4 = ["alt4.gmr-smtp-in.l.google.com", 40]
  }

  zone_id  = cloudflare_zone.ericp.id
  name     = cloudflare_zone.ericp.zone
  type     = "MX"
  value    = each.value[0]
  priority = each.value[1]
}
