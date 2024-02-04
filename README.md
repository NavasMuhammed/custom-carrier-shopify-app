# Custom Carrier Shopify App - Remix

This repository contains the source code for the Custom Carrier Shopify App, built using the Remix framework. The app allows merchants to create custom carriers and define multiple shipping rules based on various criteria such as postal codes.

## Prerequisites

Before setting up the Custom Carrier Shopify App, ensure you have the following prerequisites:

1. Node.js: Ensure Node.js is installed on your system. You can download and install Node.js from  [here](https://nodejs.org/en/download/).
2. PostgreSQL Database: Preferably, have a PostgreSQL database instance set up and accessible.
3. Prisma ORM: Prisma should be installed and configured.
4. Shopify CLI: Install the latest version of Shopify CLI.

## Setup

To set up the Custom Carrier Shopify App, follow these steps:

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Install dependencies using your preferred package manager.
   
Using npm:

```shell
npm install
```
### Local Development

Using npm:

```shell
npm run dev
```
4. Configure Prisma to connect to your PostgreSQL database instance.


### Build

Remix handles building the app for you, by running the command below with the package manager of your choice:

Using npm:

```shell
npm run build
```

## Deployment 
For deployment, follow these steps:

1. Utilize the provided Docker file for containerization.
2. Host the container on DigitalOcean or your preferred hosting platform.

## app usage - dashboard
![image](https://github.com/NavasMuhammed/custom-carrier-shopify-app/assets/83510230/eb93a37a-fd64-4f51-9108-a0bad43232ca)
1. This is the admin dashboard where merchants can create a custom carrier provider
2. user have to provide a name and a public api url for managing thre rate logic .
3. user have to set the app's url with a /api as a public url to use the app's rate rules

## app usage - custom rules 
![image](https://github.com/NavasMuhammed/custom-carrier-shopify-app/assets/83510230/ace38548-777e-464b-bb33-6dc5de69e25f)
![image](https://github.com/NavasMuhammed/custom-carrier-shopify-app/assets/83510230/6c3e30df-9b96-44eb-8897-902a06d24aa3)

1. After a custom provider is created merchant can create custom rules based on many criterias like postal code
2. Merchant have to set trigger value for setting the shiping rates and have to select the currency

## store front 
1. At the checkout when the trigger condition is met the rate will appear
![image](https://github.com/NavasMuhammed/custom-carrier-shopify-app/assets/83510230/6e32b89a-4b3c-4954-b305-736281cbf737)

