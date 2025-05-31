# 001: Implementing Authentication and Authorization Protocols to Improve Security

## Status
Proposed

## Context
In the current version of MusicApp, users can add, modify, delete, view, and listen to music without any authentication. This creates several issues:
- There is no way to identify users, so all actions are performed anonymously;
- There is no protection for personal tracks;
- API requests are executed without any access control checks, leading to potential security vulnerabilities.

Therefore, there is a need to implement authentication and authorization to ensure a basic level of security, increase user trust, and lay the foundation for future feature expansion.

## Decision

Firebase Authentication is proposed as the external authentication service.

### Firebase Authentication will provide:
- Email/password registration with password validation and reset flows  
- Login via third-party providers such as Google and Apple  
- Access tokens to secure frontend-only content  
- Automatic session handling on the client via Firebase SDK  

### Key integration aspects with the React client:
- Firebase SDK manages authentication state and token lifecycle  
- After logging in, users receive a `User` object (UID)  
- Protected routes restrict access based on login state  
- The UI adapts based on user roles

### Role-Based Access Control (RBAC) implemented entirely on the client:
- `user`:  
  - Can create, edit, and delete their own tracks  
- `admin`:  
  - Can view usage analytics  
  - Manage authenticated users (e.g., review roles, deactivate accounts)

## Rationale

Firebase Authentication was selected for the following reasons:

- **Ease of integration**: Provides complete SDKs for web and backend, reducing development time.
- **Multi-provider support**: Built-in support for email/password and social login providers (Google, Apple).
- **Security best practices**: Handles secure token generation and validation, following OAuth 2.0 and OpenID Connect standards.
- **Scalability**: Suitable for MVP and scalable for growth.
- **Free tier**: Ideal for current project size and budget constraints.
- **Automatic security updates**: Maintains up-to-date security without extra effort.

This approach enables implementation of a secure, scalable, and extensible authentication system with minimal overhead.

---

## Alternatives Considered

| Option               | Pros                                                                 | Cons                                                             |
|----------------------|----------------------------------------------------------------------|------------------------------------------------------------------|
| **Firebase Auth**     | Easy setup, great documentation, supports social providers, free tier | Vendor lock-in, limited customization                           |
| **Auth0**             | Extremely flexible, enterprise-ready features, great RBAC support     | Complex to set up, expensive after free tier                    |
| **Custom OAuth + JWT**| Full control, good for learning, no external dependencies             | High implementation effort, more security responsibility on project team  |

Firebase Auth was chosen because it strikes the best balance between implementation speed, feature set, and security for current needs.

---

## Consequences

### Positive
- Improved security — access limited to authenticated users
- Personalization — supports user profiles and saved content
- Legal and ethical compliance — controlled access to private content
- Better UX — third-party login speeds onboarding
- Flexible RBAC — supports future admin/moderation features

### Negative
- Slight increase in complexity — additional setup for SDK and tokens
- Dependency on external provider (Firebase)
- Learning curve if unfamiliar with Firebase