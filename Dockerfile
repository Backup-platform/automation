
# # Use the official Node.js image as the base image
FROM mcr.microsoft.com/playwright:v1.43.0-jammy
# FROM node:20
 
# Set the working directory inside the container
WORKDIR /app

# COPY the needed files to the app folder in Docker image
COPY pages/ /app/pages/
COPY playwright/ /app/playwright
COPY test-data/ /app/pages/
COPY tests/ /app/tests/
COPY playwright.config.ts /app/
COPY package.json /app/
COPY package-lock.json /app/

RUN apt-get update && \
    apt-get install default-jre -y

RUN npm ci
RUN npx playwright install --with-deps
