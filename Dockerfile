FROM node:18.9.0-alpine3.16 AS builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /deps

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN if [ "$NODE_ENV" = "production" ] ; then npm ci --omit=dev --ignore-scripts; else npm ci ; fi

# ============================================================
#                          Application
# ============================================================

FROM node:18.9.0-alpine3.16 as application

ARG NODE_ENV

# Set the working directory
WORKDIR /app

# Copy the node_modules from the builder stage
COPY --from=builder /deps/node_modules ./node_modules

# Copy the app source code
COPY . .

# If production we need Typescript to build our app
RUN if [ "$NODE_ENV" = "production" ] ; then npm install typescript -g && npm run build ; fi

CMD exec npm run start:${NODE_ENV}