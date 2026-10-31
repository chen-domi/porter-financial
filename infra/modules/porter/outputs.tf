output "api_url" {
  value = aws_apigatewayv2_api.http.api_endpoint
}

output "api_function_name" {
  value = aws_lambda_function.api.function_name
}

output "migrate_function_name" {
  value = aws_lambda_function.migrate.function_name
}

output "jobs_queue_url" {
  value = aws_sqs_queue.jobs.url
}
