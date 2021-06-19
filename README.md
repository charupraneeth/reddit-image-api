# Reddit image api

A simple api wrapper for Reddit images

## API Reference

#### Get image from a subreddit

```http
  GET /api/v1/${subreddit}?after=${after}
```

| Parameter   | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `subreddit` | `string` | **Required**. The name of subreddit |
| `after`     | `string` | **Optional**. The name of subreddit |
