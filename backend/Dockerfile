FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Set port and expose it
ENV PORT=5000
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
