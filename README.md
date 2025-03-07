## REALORNOT


## Description
REALORNOT is a project designed to determine the authenticity of information using advanced verification techniques. It consists of a server that processes the data and a client that provides a user-friendly interface for interacting with the system.

## Why
The spread of misinformation has become a significant issue in today's digital world. This project aims to help users quickly identify whether information is real or not, leveraging modern technology to combat false narratives.

## How to Start the Project

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

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit: `git commit -m "Description of changes"`
4. Push to your branch: `git push origin feature-branch`
5. Open a pull request for review.

## License
This project is licensed under the MIT License.

## Contact
For questions or suggestions, feel free to open an issue or reach out to the maintainers.


