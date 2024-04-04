FROM ubuntu:22.04
# Update system and install npm
RUN apt-get update -y 
RUN apt update
RUN apt upgrade -y
RUN apt-get install npm -y
RUN apt-get install curl -y
RUN cd ~
RUN curl -sL https://deb.nodesource.com/setup_21.x -o /tmp/nodesource_setup.sh
RUN apt-get install nodejs -y

WORKDIR /s24-killer-sudoku

# Copies over the React app and makefile
COPY ./ /s24-killer-sudoku

RUN npm install 
RUN npm install express

EXPOSE 3000

CMD [ "make" ]
