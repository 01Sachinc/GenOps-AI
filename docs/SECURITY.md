# Security Architecture & Best Practices

## 1. Authentication Flow (JWT)
The platform uses a stateless JWT (JSON Web Token) architecture.
- **Login**: User provides credentials -> Backend validates -> Returns signed JWT.
- **Verification**: Frontend includes `Authorization: Bearer <token>` in every request.
- **Algorithm**: HS256 (HMAC-SHA256).

## 2. OAuth2 Integration
Support for Google and GitHub social logins:
- **Flow**: Redirect to Provider -> Success Handler -> Backend generates JWT -> Redirect to Frontend with token.

## 3. Database Security
- **MySQL**: Credentials managed via Kubernetes Secrets or Environment Variables.
- **Redis**: Protected by internal network isolation; TLS recommended for production.

## 4. Docker Security
- **Multi-stage Builds**: Reduced image size and minimized attack surface.
- **User Permissions**: Containers should run as non-root users (configured in Dockerfiles).
- **Base Images**: Using stable, minimal Alpine/Temurin JRE images.

## 5. Secrets Management
- Never commit `.env` or `application.properties` with real secrets.
- Use HashiCorp Vault or AWS Secrets Manager for enterprise production environments.
