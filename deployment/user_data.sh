#!/bin/bash

# Update system
yum update -y

# Install required packages
yum install -y curl rpm wget

# Install Node.js 22
echo "install node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
source ~/.bashrc
nvm install --lts
nvm use --lts

yum install git -y

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create application user
useradd -m -s /bin/bash nodeapp

# Create application directory
mkdir -p /opt/corelight-api

# Clone the repository
cd /opt/corelight-api
git clone ${github_repo} .
git checkout ${github_branch}

# Install dependencies
npm install

export NODE_ENV=production
node index.js
# Log completion
echo "Corelight API deployment completed at $(date)" >> /var/log/user-data.log
