# Stage 1: Dependency cache
FROM denoland/deno:latest AS deps
WORKDIR /app

# Copy only essential files to cache dependencies
COPY deno.json deno.lock* fresh.config.ts tailwind.config.ts dev.ts main.ts ./
# Copy necessary directories for dependencies
COPY components/ ./components/
COPY hooks/ ./hooks/
COPY islands/ ./islands/
COPY routes/ ./routes/
COPY static/ ./static/

# Cache dependencies
RUN deno cache main.ts dev.ts



# Stage 2: Application build
FROM denoland/deno:latest AS builder
WORKDIR /app

# Bring dependency cache from the previous stage
COPY --from=deps /deno-dir /deno-dir
COPY --from=deps /app ./

# Copy any additional files that might have been added
COPY . .

# Generate the Fresh production bundle
RUN deno task build



# Stage 3: Final optimized image
FROM denoland/deno:latest
WORKDIR /app

# Copy only what is necessary to run the application
COPY --from=builder /app ./
COPY --from=builder /deno-dir /deno-dir

# Expose Fresh's default port
EXPOSE 8000

# Environment variables for production
ENV DENO_ENV=production
ENV API_URL=http://backend:8080

# Command to run the application in production
CMD ["deno", "task", "start"]
