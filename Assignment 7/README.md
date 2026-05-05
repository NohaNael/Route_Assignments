# Sequelize Models Setup

## Folder Structure

```text
src/
  config/
    database.js
  controllers/
    userController.js
    postController.js
    commentController.js
  models/
    User.js
    Post.js
    Comment.js
    index.js
  routes/
    userRoutes.js
    postRoutes.js
    commentRoutes.js
    index.js
  app.js
  index.js
.env.example
package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set DB values.

3. Run:

```bash
npm start
```

This will:
- Connect to the DB
- Create/update tables for `Users`, `Posts`, `Comments`
- Apply foreign key relations
- Start an Express API server

## API Endpoints

- `GET /health`
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/posts`
- `GET /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/comments`
- `GET /api/comments`
- `GET /api/comments/:id`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`
