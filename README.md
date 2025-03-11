## REALORNOT
Open-source web multiplayer game, containing different challenging gamemodes and a way for people to differentiate the AI images from the reality

## Why
The spread of misinformation has become a significant issue in today's digital world. This realORnot aims to help users quickly identify whether an image is real or AI generated.

## Getting started

### Server
- Runs locally on `:8080`
- Build the Docker image:
  ```sh
  docker build -f server/Dockerfile -t realornot-server .
  ```
- Run the server container:
  ```sh
  docker run -p 8080:8080 realornot-server
  ```

### Client
- Runs locally on `:3000`
- Navigate to the `client` directory and install dependencies:
  ```sh
  cd client
  npm install
  ```
- Start the client:
  ```sh
  npm start
  ```

## Usage
Once the server and client are running:
1. Open a browser and navigate to `http://localhost:3000`
2. Enter the information you want to verify.
3. Receive real-time feedback on its authenticity.



## License
This project is licensed under the Apache 2.0 License.

## Contributing
Contributions are welcome, whether you open an issue, improve the documentation or reach out.

Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit: `git commit -m "Description of changes"`
4. Push to your branch: `git push origin feature-branch`
5. Open a pull request for review.


