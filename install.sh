sudo swapon --show
sudo fallocate -l 1G /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

git clone https://github.com/komapc/MERN.git
sudo apt update
sudo apt install nodejs
sudo apt install npm
 npm install