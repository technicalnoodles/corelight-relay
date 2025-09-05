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
  description = "HTTPS URL for the application via ALB"
  value       = "https://${aws_lb.corelight_api.dns_name}"
}

output "app_url_direct" {
  description = "Direct HTTP URL to EC2 instance"
  value       = "http://${aws_eip.corelight_api.public_ip}"
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.corelight_api.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.corelight_api.zone_id
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
