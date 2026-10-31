terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  # Bucket comes from infra/shared:  terraform init -backend-config="bucket=porter-tf-state-<account>"
  backend "s3" {
    key          = "staging/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = { project = "porter", environment = "staging", managed_by = "terraform" }
  }
}

variable "image_uri" {
  type = string
}

variable "clerk_issuer" {
  type = string
}

variable "allowed_user_ids" {
  type = list(string)
}

variable "alert_email" {
  type = string
}

module "porter" {
  source           = "../../modules/porter"
  environment      = "staging"
  image_uri        = var.image_uri
  clerk_issuer     = var.clerk_issuer
  allowed_user_ids = var.allowed_user_ids
  alert_email      = var.alert_email
}

output "api_url" {
  value = module.porter.api_url
}

output "migrate_function_name" {
  value = module.porter.migrate_function_name
}
