# 002: Codebase Refactoring to Improve Maintainability

## Status  
Proposed  

## Context  
The current project structure is organized by functional modules, where each part of the functionality — such as track management or audio handling — is placed in a separate folder with its own components, APIs, hooks, and utilities.  
This approach simplifies scalability, but within these modules, there are violations of clean code principles, making further maintenance more difficult.

Main issues include:  
- Components have too many responsibilities (violation of the Single Responsibility Principle);  
- Business logic is often mixed with UI components;  
- Insufficient use of abstractions;  
- Difficulties in testing due to tightly coupled components;  
- Challenges in scaling and adding new features.  

These issues complicate maintenance and further development of the application, increase the risk of bugs during updates, and slow down feature delivery.

## Decision  
It is proposed to improve maintainability through:

- Separating business logic from UI components (by introducing services and custom hooks);  
- Splitting large components into smaller, focused ones;  
- Introducing interfaces and abstractions for API and service layers;  
- Improving the project structure — creating separate folders for models, services, hooks, and components;  
- Reducing component coupling to improve testability.  

## Consequences  

### Positive:  
- Easier to introduce changes and add new features;  
- Improved code readability and testability.  

### Negative:  
- Requires time and effort to refactor;  
- Potential bugs during refactoring;  
- Risk of introducing new issues during restructuring.  
