<h1 align="center">Welcome to reddit-image-scraper 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> API wrapper for reddit images

### ✨ [Demo](https://reddit-image-api.herokuapp.com/api/v1)

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

## API Reference

#### Get image from a random subreddit

```http
  GET /api/v1/
```

#### Get random image from random subreddit

```http
  GET /api/v1/random
```

#### Get image from a subreddit

```http
  GET /api/v1/${subreddit}?after=${after}
```

| Parameter   | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `subreddit` | `string` | **Required**. The name of subreddit |
| `after`     | `string` | **Optional**. The name of subreddit |

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
