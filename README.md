
# VocaGraph

A website to study languages based on semantic map.


## Features

- `Semantic map`: Visualize words and their connections to enhance vocabulary memorization.
- `Document reader`: Read and interact with `.docx` files directly within the application.
- `Dictionary functionality`: Look up meanings of words (`English` support only)





## Demo
Visit the site [here](https://frontend-1il6.onrender.com/)

The server shut down due to inactivity, so the first request after that may take longer to process.





## Run Locally

Clone the project

```bash
  git clone https://github.com/huy-ngndinh/VocaGraph
```

Go to the project directory

```bash
  cd VocaGraph
```

Run with Docker

```zsh
docker-compose up
```




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL`: `URL` that the backend will use to connect to your database.

`TOKEN_KEY`: used to hash password

`PORT`: where the backend will run during development. Please set it to `3000`

`PROD_PORT`: where the backend will run during production.




## Feedback

If you have any feedback, please create an issue or reach out to me at `huy.ngndinh@gmail.com`

