
data "aws_iam_policy_document" "ghaction_iam_statements" {

  statement {
    sid    = "AllowBucketList"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
    ]
    resources = [
      module.cdn.s3_bucket_arn
    ]
  }

  statement {
    sid    = "AllowBucketOps"
    effect = "Allow"
    actions = [
      "s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject"
    ]
    # allow object options on this specific buckets
    #tfsec:ignore:aws-iam-no-policy-wildcards
    resources = [
      "${module.cdn.s3_bucket_arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "ghaction_iam_policy" {
  name   = "${module.this.id}-ghaction-policy"
  role   = aws_iam_role.ghaction_role.name
  policy = data.aws_iam_policy_document.ghaction_iam_statements.json
}

data "aws_iam_policy_document" "ghaction_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity", "sts:TagSession"]
    principals {
      type = "Federated"
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    dynamic "condition" {
      for_each = var.ghaction_role_conditions

      content {
        test     = condition.value.test
        variable = condition.value.variable
        values   = condition.value.values
      }
    }
  }
}

resource "aws_iam_role" "ghaction_role" {
  name                 = "${module.this.id}-spadeploy-ghaction"
  assume_role_policy   = data.aws_iam_policy_document.ghaction_assume_role.json
  description          = "The IAM role used to push the spa from github actions"
  max_session_duration = 3600
  path                 = "/github-service-roles/"
}

