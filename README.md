# My Private Notes

Build a full-stack Notes App where every user's notes are private and permanently associated with their account.

Core Requirements

1. Authentication

User must Sign Up with:

Name

Email

Password

User can then Log In with email and password.

Hash passwords securely before storing them.

Use JWT authentication with HTTP-only cookies or another secure authentication method.

Add authentication middleware to protect private routes.

Users must not be able to access another user's notes.

2. Notes
After login, the user can:

Create a note

View their notes

Edit a note

Delete a note

View a single note

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://notelyapp21.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b9194d35-5838-40b1-a2cb-e6cecd8202fd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
