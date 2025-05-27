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
It is proposed to implement OAuth 2.0 for user authentication and JWT for authorization, which will allow:
- Logging in via third-party providers (Google, Apple);
- Supporting email/password registration with password validation;
- Storing user roles and permissions in JWT tokens;
- Creating protected routes.

## Consequences

### Positive:
- Improved security — protection of personal data and content access;
- Personalization — support for user profiles and custom content;
- Legal compliance — better control over copyright and content usage;
- Trust — users are more likely to trust an application with authentication.

### Negative:
- Increased complexity — requires additional components and logic;
- Development delays — more time needed to implement secure authentication;
- Potential dependency — on third-party services (e.g., Auth0 or Firebase);
- UX impact — sign-in and registration may discourage some users.
