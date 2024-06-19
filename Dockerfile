# FROM node:20-bookworm

# WORKDIR /app

# COPY package* /app/
# COPY tests/ /app/tests/
# COPY pages/ /app/pages/
# COPY .auth/ /app/playwright/
# COPY playwright.config.ts /app/


# RUN npm ci
# RUN npx -y playwright@1.41.1 install --with-deps
########################################################

# # Use the official Node.js image as the base image
FROM mcr.microsoft.com/playwright:v1.42.0-jammy
# FROM node:20
 
# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
 
# Install dependencies
# RUN npm ci
 
# Copy the rest of the application code to the container
COPY . . 
# Set a default value for the PORT environment variable
ENV PORT=42420
# Expose the specified port
EXPOSE $PORT

#RUN npm i -D @playwright/test allure-playwright
# Run Playwright tests when the container starts

RUN apt-get update && \
    apt-get install default-jre -y

RUN npx -y playwright@1.42.0 install --with-deps

CMD npx playwright test --project=chromium && \
    npx allure serve allure-results -h 0.0.0.0 -p $PORT
    # npx allure generate allure-results -o allure-report --clean && \
    # npx allure open allure-report -h localhost -p $PORT
    # ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/bin/java