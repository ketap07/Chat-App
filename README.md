## create a new repository on the command line
echo "# Chat-Application" >> README.md

1. git init
2. git add README.md
3. git commit -m "first commit"
4. git branch -M main
5. git remote add origin https://github.com/ketap07/Chat-Application.git
6. git push -u origin main

## push an existing repository from the command line
1. git remote add origin https://github.com/ketap07/Chat-Application.git
2. git branch -M main
3. git push -u origin main

## git config

**Git to check the who is the user of git**
1. git config user.name  
2. git config user.email 

**To add config of git**
1. git config --global user.name "Your Name"
2. git config --global user.email "your.email@example.com"
