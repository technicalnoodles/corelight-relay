# Terraform EC2 Deployment for Corelight API

This directory contains Terraform configuration files for deploying the Corelight API to AWS EC2 without Docker, using direct GitHub repository deployment.

## Files Overview

- `main.tf` - Main Terraform configuration with AWS resources
- `variables.tf` - Input variables for the deployment
- `outputs.tf` - Output values after deployment
- `user_data.sh` - EC2 user data script for application setup
- `terraform.tfvars.example` - Example variables file

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (version >= 1.0)
3. **AWS Key Pair** created in your target region
4. **GitHub repository** with your Corelight API code

## Quick Start

1. **Copy and configure variables:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your specific values
   ```

2. **Initialize Terraform:**
   ```bash
   terraform init
   ```

3. **Plan the deployment:**
   ```bash
   terraform plan
   ```

4. **Deploy the infrastructure:**
   ```bash
   terraform apply
   ```

5. **Access your application:**
   - HTTPS: `https://<public-ip>`
   - Development: `http://<public-ip>:6000`
   - SSH: `ssh -i ~/.ssh/<key-pair>.pem ec2-user@<public-ip>`

## Configuration Variables

### Required Variables

- `key_pair_name` - AWS key pair name for SSH access
- `github_repo` - GitHub repository URL (HTTPS format)

### Optional Variables

- `aws_region` - AWS region (default: us-east-1)
- `project_name` - Project name for resource naming (default: corelight-api)
- `instance_type` - EC2 instance type (default: t3.micro)
- `github_branch` - Git branch to deploy (default: main)
- `ssh_cidr_blocks` - CIDR blocks for SSH access (default: 0.0.0.0/0)
- `dev_port_cidr_blocks` - CIDR blocks for port 6000 access (default: 0.0.0.0/0)

## Infrastructure Components

### Networking
- **VPC** with DNS support enabled
- **Public subnet** with auto-assign public IP
- **Internet Gateway** for internet access
- **Route table** with default route to IGW

### Security
- **Security Group** allowing:
  - Port 443 (HTTPS) from anywhere
  - Port 22 (SSH) from specified CIDR blocks
  - Port 6000 (development) from specified CIDR blocks
- **IAM Role** with CloudWatch Logs permissions
- **Encrypted EBS volume**

### Compute
- **EC2 instance** with Amazon Linux 2
- **Elastic IP** for static public IP address
- **CloudWatch Log Group** for application logs

## Deployment Process

The user data script automatically:

1. **System Setup:**
   - Updates Amazon Linux 2
   - Installs Git, Node.js 22, and CloudWatch agent

2. **Application Deployment:**
   - Creates dedicated `nodeapp` user
   - Clones GitHub repository to `/opt/corelight-api`
   - Installs npm dependencies
   - Configures systemd service

3. **Security Configuration:**
   - Sets up authbind for port 443 binding
   - Applies security restrictions to systemd service
   - Configures proper file permissions

4. **Monitoring Setup:**
   - Configures CloudWatch agent for metrics and logs
   - Sets up health check monitoring
   - Creates log forwarding for application logs

## Post-Deployment

### Service Management
```bash
# Check service status
sudo systemctl status corelight-api

# View logs
sudo journalctl -u corelight-api -f

# Restart service
sudo systemctl restart corelight-api
```

### Application Updates
```bash
# Use the built-in update script
sudo -u nodeapp /opt/corelight-api/update.sh
```

### Health Monitoring
- Health checks run every 5 minutes via cron
- Logs available at `/var/log/corelight-health.log`
- CloudWatch metrics for CPU, memory, and disk usage

## Security Considerations

1. **Restrict SSH access** by updating `ssh_cidr_blocks` to your IP
2. **Restrict development port** by updating `dev_port_cidr_blocks`
3. **Use HTTPS** for production traffic (port 443)
4. **Monitor CloudWatch logs** for security events
5. **Keep dependencies updated** using the update script

## Troubleshooting

### Common Issues

1. **Service won't start:**
   ```bash
   sudo journalctl -u corelight-api --no-pager
   ```

2. **Port 443 permission denied:**
   - Check authbind configuration
   - Verify nodeapp user permissions

3. **GitHub clone fails:**
   - Verify repository URL and branch
   - Check internet connectivity

4. **Health check fails:**
   - Verify JWT validation is working
   - Check application logs

### Log Locations
- Application logs: `sudo journalctl -u corelight-api`
- System logs: `/var/log/messages`
- Health check logs: `/var/log/corelight-health.log`
- User data logs: `/var/log/user-data.log`

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

## Cost Optimization

- Uses `t3.micro` instance (eligible for AWS Free Tier)
- EBS volume encryption included
- CloudWatch logs with 7-day retention
- Minimal resource allocation for development/testing

## Production Considerations

For production deployments, consider:
- Using larger instance types (`t3.small` or higher)
- Setting up Auto Scaling Groups
- Adding Application Load Balancer
- Implementing backup strategies
- Using AWS Certificate Manager for SSL
- Setting up monitoring and alerting
