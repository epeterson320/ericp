terraform {
  required_providers {
    github = {
      source  = "hashicorp/github"
      version = "4.1.0"
    }
    netlify = {
      source  = "AegirHealth/netlify"
      version = "0.6.12"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "2.15.0"
    }
  }
}

variable "description" {
  type = string
  default = ""
}

variable "hostname" {
  type = string
}

variable "repo_name" {
  type = string
  default = ""
}

variable "netlify_unique_name" {
  type = string
}

variable "build_cmd" {
  type = string
  default = null
}

variable "publish_dir" {
  type = string
}

output "resolved_hostname" {
  value = "${netlify_site.site.name}.netlify.app"
}

locals {
  domains = split(".", var.hostname)
  domain = join(".", slice(local.domains, 1, length(local.domains)))
  subdomain = local.domains[0]
}

data "cloudflare_zones" "zone" {
  filter {
    name = local.domain
  }
}

data "github_repository" "default" {
  full_name = "epeterson320/ericp"
}

resource "github_repository" "repo" {
  count = var.repo_name == "" ? 0 : 1

  name = var.repo_name
  description = var.description
  homepage_url = "https://${var.hostname}"
  has_issues = true
}

resource "netlify_site" "site" {
  name = var.netlify_unique_name
  custom_domain = var.hostname

  repo {
    command = var.build_cmd
    dir = var.publish_dir
    provider = "github"
    repo_path = var.repo_name == "" ? data.github_repository.default.full_name : github_repository.repo[0].full_name
    repo_branch = var.repo_name == "" ? data.github_repository.default.default_branch : github_repository.repo[0].default_branch
  }
}

resource "cloudflare_record" "cname" {
  zone_id = data.cloudflare_zones.zone.id
  name = local.subdomain
  value = "${netlify_site.site.name}.netlify.app"
  type = "CNAME"
  proxied = true
}
