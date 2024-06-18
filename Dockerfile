FROM node
WORKDIR /app

COPY . .
RUN npm i
RUN ["chmod", "+x", "/app/scripts/start_contaier.sh"]

#ENTRYPOINT ["/bin/sh", "-c", "/app/scripts/start_contaier.sh"]