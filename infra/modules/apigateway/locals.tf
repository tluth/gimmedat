locals {
  product_domain = "${var.domain_prefix}.${data.aws_route53_zone.public.name}"
}
