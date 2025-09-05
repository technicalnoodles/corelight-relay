output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.corelight_api.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.corelight_api.public_ip
}

output "public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.corelight_api.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.key_pair_name}.pem ec2-user@${aws_eip.corelight_api.public_ip}"
}

output "app_url_https" {
  description = "HTTPS URL for the application"
  value       = "https://${aws_eip.corelight_api.public_ip}"
}

output "app_url_dev" {
  description = "Development URL for the application (port 6000)"
  value       = "http://${aws_eip.corelight_api.public_ip}:6000"
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.corelight_api.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}
