terraform {
  required_providers {
    github = {
      source = "hashicorp/github"
      version = "4.1.0"
    }
    netlify = {
      source = "AegirHealth/netlify"
      version = "0.6.12"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "2.15.0"
    }
  }
}

provider "github" {
  token = var.github_token
}

provider "netlify" {
  token = var.netlify_access_token
  base_url = "https://api.netlify.com/api/v1"
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