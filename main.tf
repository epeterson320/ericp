terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "2.15.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_zone" "ericp" {
  zone = "ericp.co"
}

resource "cloudflare_zone_dnssec" "ericp" {
  zone_id = cloudflare_zone.ericp.id
}