#!/bin/bash

# Update system
yum update -y

# Install required packages
yum install -y git curl

# Install Node.js 22
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
yum install -y nodejs

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create application user
useradd -m -s /bin/bash nodeapp

# Create application directory
mkdir -p /opt/corelight-api
chown nodeapp:nodeapp /opt/corelight-api

# Clone the repository
cd /opt/corelight-api
sudo -u nodeapp git clone ${github_repo} .
sudo -u nodeapp git checkout ${github_branch}

# Install dependencies
sudo -u nodeapp npm install --production

# Create systemd service file
cat > /etc/systemd/system/corelight-api.service << 'EOF'
[Unit]
Description=Corelight API Service
After=network.target

[Service]
Type=simple
User=nodeapp
WorkingDirectory=/opt/corelight-api
Environment=NODE_ENV=production
Environment=PORT=80
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=corelight-api

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/corelight-api

[Install]
WantedBy=multi-user.target
EOF

# Create CloudWatch agent configuration
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'EOF'
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/messages",
                        "log_group_name": "/aws/ec2/corelight-api",
                        "log_stream_name": "{instance_id}/system"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "CWAgent",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start and enable CloudWatch agent
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent

# Configure journald to forward to CloudWatch
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/cloudwatch.conf << 'EOF'
[Journal]
ForwardToSyslog=yes
EOF

# Restart journald
systemctl restart systemd-journald

# Set up log forwarding for application logs
cat > /opt/aws/amazon-cloudwatch-agent/etc/custom-log-config.json << 'EOF'
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/messages",
                        "log_group_name": "/aws/ec2/corelight-api",
                        "log_stream_name": "{instance_id}/application",
                        "log_group_retention_in_days": 7
                    }
                ]
            }
        }
    }
}
EOF

# Allow nodeapp user to bind to port 80 (requires root privileges)
# We'll use authbind for this
yum install -y authbind || (
    # If authbind is not available, install from source
    cd /tmp
    wget http://ftp.debian.org/debian/pool/main/a/authbind/authbind_2.1.2.tar.gz
    tar -xzf authbind_2.1.2.tar.gz
    cd authbind-2.1.2
    make
    make install
)

# Configure authbind for port 80
mkdir -p /etc/authbind/byport
touch /etc/authbind/byport/80
chown nodeapp:nodeapp /etc/authbind/byport/80
chmod 755 /etc/authbind/byport/80

# Update the systemd service to use authbind
cat > /etc/systemd/system/corelight-api.service << 'EOF'
[Unit]
Description=Corelight API Service
After=network.target

[Service]
Type=simple
User=nodeapp
WorkingDirectory=/opt/corelight-api
Environment=NODE_ENV=production
Environment=PORT=80
ExecStart=/usr/bin/authbind --deep /usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=corelight-api

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/corelight-api

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start the service
systemctl daemon-reload
systemctl enable corelight-api
systemctl start corelight-api


# Create update script for easy deployments
cat > /opt/corelight-api/update.sh << 'EOF'
#!/bin/bash
# Update script for easy redeployment
cd /opt/corelight-api
git pull origin ${github_branch}
npm install --production
sudo systemctl restart corelight-api
echo "Application updated and restarted"
EOF

chmod +x /opt/corelight-api/update.sh
chown nodeapp:nodeapp /opt/corelight-api/update.sh

# Log completion
echo "Corelight API deployment completed at $(date)" >> /var/log/user-data.log
