variable "environment" {
  description = "staging or prod."
  type        = string
  validation {
    condition     = contains(["staging", "prod"], var.environment)
    error_message = "environment must be staging or prod."
  }
}

variable "image_uri" {
  description = "Full ECR image URI (repo@sha256:digest or repo:tag) for the API image."
  type        = string
}

variable "clerk_issuer" {
  description = "Clerk Frontend API URL, used as the JWT issuer."
  type        = string
}

variable "allowed_user_ids" {
  description = "Clerk user IDs allowed to call the API."
  type        = list(string)
}

variable "alert_email" {
  description = "Where alarm notifications are sent."
  type        = string
}

variable "throttle_rate_limit" {
  description = "Steady-state requests per second allowed at API Gateway."
  type        = number
  default     = 20
}

variable "throttle_burst_limit" {
  type    = number
  default = 40
}

variable "log_retention_days" {
  type    = number
  default = 14
}
