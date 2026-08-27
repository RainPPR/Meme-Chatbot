# GitHub Pages Deployment & SSG Build

## Deployment Pipeline Overview

The project is architected for zero-configuration deployment to GitHub Pages using GitHub Actions continuous delivery.

## Workflow Triggers & Execution Steps

- **Trigger Conditions**: Pushes to `main` or `master` branches, as well as manual workflow dispatch.
- **Environment Configuration**: Ubuntu runner running Node.js 20 LTS.
- **Export Mode**: Executed with static export flags enabled, generating purely static HTML, CSS, and client-side JavaScript assets into the `out/` distribution folder.
- **Pages Artifact**: Uploaded to GitHub Pages runner and deployed under the repository's GitHub Pages domain.

## GitHub Repository Setup Instructions

1. Navigate to repository settings on GitHub.
2. Under **Code and automation**, select **Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. Push new commits to the repository. The workflow will automatically build and publish the application.
