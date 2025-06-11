sudo apt-get install -y nodejs npm

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh

sudo adduser student
# use insa as password

sudo sh -c 'echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config.d/50-cloud-init.conf'
sudo sh -c 'echo "MaxSessions 50" >> /etc/ssh/sshd_config.d/60-ssh-simultaneous.conf'
sudo service ssh restart

