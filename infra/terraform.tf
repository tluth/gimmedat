terraform {
  required_version = ">= 1.4.0"

  backend "s3" {
    encrypt = "true"
    bucket = "gimmedat-terraform"
    key = "gimmedat.tfstate"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.1.0"
    }
  }
}

provider "aws" {
  alias  = "tags"
  region = var.default_region
}

provider "aws" {
  region = var.default_region
}
