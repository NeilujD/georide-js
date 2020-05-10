# georide-js

`georide-js` is a tiny JavaScript API client for [Georide](https://georide.fr/) which is awesome french tech, mostly if you are a motorcycle rider.


## Georide

Georide a french company that provide security and GPS features for motorcycle. 
To use it you need to buy from them a small box full of sensors that you put on your bike directly powered by its battery.

To make the UX great they also provide a mobile app (iOS and Android supported) and they made their API public so the users/customers can play with it.


## Features

* `fetch` : The project is using fetch to request the data from the API (`node-fetch` for Node environment). It permit to handle easyly request promises and make it usable in Node application as in browser's.

* Customizable option : If Georide decide to change their API endpoints you can set options so your client can still works.

* Socket client implementation : It implement `socket.io` client to simplify the event subscription the API provide.


## Install

```sh
npm i -s georide-js
```

## How to use

Example :

```js
import Georide from './lib/georide'


const EMAIL = '<your_georide_email_address>'
const PASSPORT = '<your_georide_password>'

const main = async () => {
  // Create the client
  const client = new Georide(EMAIL, PASSPORT)

  // Authenticate the user
  const token = await client.login()

  // Retrieve the user infos
  const info = await client.User.info()

  // Subscribe to the `position` event
  client.onPosition(message => {
    const { trackerId, latitude, longitude, moving } = message
  })
}

main()
```

## Test

```sh
npm test
```