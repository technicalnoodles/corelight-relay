terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data source for latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# Route Table for Public Subnet
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Second Public Subnet for ALB (required for multi-AZ)
resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-2"
  }
}

# Route Table Association for Second Subnet
resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# Security Group for XDR IPs - HTTPS
resource "aws_security_group" "xdr-ips-https" {
  name_prefix = "${var.project_name}-xdr-https-sg"
  vpc_id      = aws_vpc.main.id

  # HTTPS access from specific IPs
  ingress {
    description = "HTTPS from specific IPs"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [
      "35.168.234.165/32",
      "35.172.5.95/32",
      "34.225.249.84/32",
      "18.213.248.192/32",
      "54.166.136.151/32",
      "54.211.175.37/32",
      "52.4.96.105/32",
      "52.44.231.95/32",
      "52.54.41.7/32",
      "52.55.87.127/32",
      "52.55.92.19/32",
      "52.205.26.61/32",
      "107.22.210.176/32",
      "107.22.217.211/32",
      "107.22.247.3/32",
      "34.251.83.242/32",
      "52.49.85.99/32",
      "52.208.164.206/32",
      "3.251.20.134/32",
      "52.48.136.126/32",
      "63.33.97.243/32",
      "18.184.151.221/32",
      "18.184.220.206/32",
      "18.196.240.228/32",
      "18.184.238.96/32",
      "18.196.75.98/32",
      "52.58.161.32/32",
      "54.248.49.240/32",
      "52.198.165.128/32",
      "52.196.126.178/32",
      "13.230.182.244/32",
      "18.181.14.110/32",
      "35.72.117.19/32",
      "3.105.113.178/32",
      "3.106.86.62/32",
      "13.236.79.226/32",
      "3.104.45.208/32",
      "13.210.255.103/32",
      "13.238.191.0/32"
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-xdr-https-sg"
  }
}

# Security Group for XDR IPs - HTTP
resource "aws_security_group" "xdr-ips-http" {
  name_prefix = "${var.project_name}-xdr-http-sg"
  vpc_id      = aws_vpc.main.id

  # HTTP access from specific IPs
  ingress {
    description = "HTTP from specific IPs"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [
      "35.168.234.165/32",
      "35.172.5.95/32",
      "34.225.249.84/32",
      "18.213.248.192/32",
      "54.166.136.151/32",
      "54.211.175.37/32",
      "52.4.96.105/32",
      "52.44.231.95/32",
      "52.54.41.7/32",
      "52.55.87.127/32",
      "52.55.92.19/32",
      "52.205.26.61/32",
      "107.22.210.176/32",
      "107.22.217.211/32",
      "107.22.247.3/32",
      "34.251.83.242/32",
      "52.49.85.99/32",
      "52.208.164.206/32",
      "3.251.20.134/32",
      "52.48.136.126/32",
      "63.33.97.243/32",
      "18.184.151.221/32",
      "18.184.220.206/32",
      "18.196.240.228/32",
      "18.184.238.96/32",
      "18.196.75.98/32",
      "52.58.161.32/32",
      "54.248.49.240/32",
      "52.198.165.128/32",
      "52.196.126.178/32",
      "13.230.182.244/32",
      "18.181.14.110/32",
      "35.72.117.19/32",
      "3.105.113.178/32",
      "3.106.86.62/32",
      "13.236.79.226/32",
      "3.104.45.208/32",
      "13.210.255.103/32",
      "13.238.191.0/32"
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-xdr-http-sg"
  }
}

# Security Group for ALB
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-alb-sg"
  vpc_id      = aws_vpc.main.id

  # HTTPS from XDR IPs
  ingress {
    description = "HTTPS from XDR IPs"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [
      "35.168.234.165/32",
      "35.172.5.95/32",
      "34.225.249.84/32",
      "18.213.248.192/32",
      "54.166.136.151/32",
      "54.211.175.37/32",
      "52.4.96.105/32",
      "52.44.231.95/32",
      "52.54.41.7/32",
      "52.55.87.127/32",
      "52.55.92.19/32",
      "52.205.26.61/32",
      "107.22.210.176/32",
      "107.22.217.211/32",
      "107.22.247.3/32",
      "34.251.83.242/32",
      "52.49.85.99/32",
      "52.208.164.206/32",
      "3.251.20.134/32",
      "52.48.136.126/32",
      "63.33.97.243/32",
      "18.184.151.221/32",
      "18.184.220.206/32",
      "18.196.240.228/32",
      "18.184.238.96/32",
      "18.196.75.98/32",
      "52.58.161.32/32",
      "54.248.49.240/32",
      "52.198.165.128/32",
      "52.196.126.178/32",
      "13.230.182.244/32",
      "18.181.14.110/32",
      "35.72.117.19/32",
      "3.105.113.178/32",
      "3.106.86.62/32",
      "13.236.79.226/32",
      "3.104.45.208/32",
      "13.210.255.103/32",
      "13.238.191.0/32"
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Security Group for EC2 to allow ALB traffic
resource "aws_security_group" "ec2_from_alb" {
  name_prefix = "${var.project_name}-ec2-alb-sg"
  vpc_id      = aws_vpc.main.id

  # HTTP from ALB
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-alb-sg"
  }
}

# Main Security Group
resource "aws_security_group" "corelight_api" {
  name_prefix = "${var.project_name}-sg"
  vpc_id      = aws_vpc.main.id

  # HTTPS - only specific IPs allowed via xdr-ips security group

  # SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-security-group"
  }
}

# IAM Role for EC2 Instance
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ec2-role"
  }
}

# IAM Policy for CloudWatch Logs
resource "aws_iam_role_policy" "ec2_policy" {
  name = "${var.project_name}-ec2-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# User Data Script
locals {
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    github_repo = var.github_repo
    github_branch = var.github_branch
  }))
}

# EC2 Instance
resource "aws_instance" "corelight_api" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  vpc_security_group_ids = [
    aws_security_group.corelight_api.id,
    aws_security_group.ec2_from_alb.id
  ]
  subnet_id              = aws_subnet.public.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = local.user_data

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }

  tags = {
    Name = "${var.project_name}-instance"
  }
}

# Elastic IP
resource "aws_eip" "corelight_api" {
  instance = aws_instance.corelight_api.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }

  depends_on = [aws_internet_gateway.main]
}

# Target Group for ALB
resource "aws_lb_target_group" "corelight_api" {
  name     = "${var.project_name}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200,500"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = {
    Name = "${var.project_name}-target-group"
  }
}

# Target Group Attachment
resource "aws_lb_target_group_attachment" "corelight_api" {
  target_group_arn = aws_lb_target_group.corelight_api.arn
  target_id        = aws_instance.corelight_api.id
  port             = 80
}

# Application Load Balancer
resource "aws_lb" "corelight_api" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public.id, aws_subnet.public_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# Self-signed certificate for HTTPS (for development/testing)
resource "aws_acm_certificate" "self_signed" {
  private_key      = tls_private_key.example.private_key_pem
  certificate_body = tls_self_signed_cert.example.cert_pem

  tags = {
    Name = "${var.project_name}-cert"
  }
}

# Private key for self-signed certificate
resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Self-signed certificate
resource "tls_self_signed_cert" "example" {
  private_key_pem = tls_private_key.example.private_key_pem

  subject {
    common_name  = "corelight-api.local"
    organization = "Corelight"
  }

  validity_period_hours = 8760 # 1 year

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

# ALB Listener for HTTPS
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.corelight_api.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.self_signed.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.corelight_api.arn
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "corelight_api" {
  name              = "/aws/ec2/${var.project_name}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-logs"
  }
}
