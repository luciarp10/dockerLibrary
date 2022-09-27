This repo has been created in order to do a step by step example to deploy an application in Kubernetes by using a Docker image. 

To use the application in your own PC execute: 

1. Install dependencies: 

    ```bash
    npm install
    ```

2. Start project: 

    ```bash
    npm start
    ```

If you want to create a Docker image with this application you have to use the file ```tasks.json``` and execute the task: ```docker-build```.


Now we are going to push the image to DockerHub:

1. Create a DockerHub account to push your image. Then, login: 
    ```bash 
    docker login 
    ```
2. Create the image tag: 
    ```bash 
    docker tag learningkubernetes.example.io:3.0 {username}/learningkubernetes.example.io:3.0
    ```
3. Push the image: 
    ```
    docker push {username}/learningkubernetes.example.io:3.0
    ```

In this version of the repo, we are going to add a Mysql Database. 
1. Install dependencies:
    ```
    npm install mysql
    ```

2. Create the Docker Image: 
    ```
    docker build -t learningkubernetes.example.bd:1.0 ./docker-bd
    ```
3. Login into Docker Hub: 
    ```
    docker login
    ```

4. Tag the Docker Image: 
    ```
    docker tag learningkubernetes.example.bd.1.0 {username}/learningkubernetes.example.bd:1.0
    ```

5. Push the image to Docker Hub: 
    ```
    docker push {username}/learningkubernetes.example.bd:1.0
    ```