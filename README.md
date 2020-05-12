[![<ORG_NAME>](https://circleci.com/gh/NeilujD/georide-js.svg?style=shield)](<LINK>)


# georide-js

`georide-js` is a tiny JavaScript API client for [Georide](https://georide.fr/) which is awesome french tech, mostly if you are a motorcycle rider.

See full API documentation [here](https://neilujd.github.io/georide-js/).


## Georide

Georide a french company that provide security and GPS features for motorcycle. 
To use it you need to buy from them a small box full of sensors that you put on your bike directly powered by its battery.

To make the UX great they also provide a mobile app (iOS and Android supported) and they made their API public so the users/customers can play with it.

See Georide API documentation [here](https://api.georide.fr/).
See Georide services status page [here](https://status.georide.fr/).


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
const Georide = require('georide-js').default


const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD

const main = async () => {
  // Create the client
  const client = new Georide(EMAIL, PASSWORD)
  // Authenticate the user
  const token = await client.login()
  // Retrieve the user info
  const info = await client.Tracker.lock()
  // Retrieve my trackers
  const trackers = await client.User.trackers()
  const myTrackers = trackers.filter(t => t.role === 'owner')
  const myTrackerId = myTrackers[0].trackerId
  // Retrieve my tracker trips
  const trips = await client.Tracker.trips(myTrackerId, new Date('May 01, 2019 00:00:00'), Date.now())
  // Lock a tracker
  await client.Tracker.lock(myTrackerId)
  // Toggle a tracker lock
  const { locked } = await client.Tracker.toggle(myTrackerId)
  // Share a trip
  const { url, shareId } = await client.Tracker.shareTrip(myTrackerId, {tripId: trips[0].id})
  // Subscribe to the `position` event
  client.onPosition(message => {
    const { trackerId, latitude, longitude, moving } = message
  })

  process.exit()
}

main()
```

## Test

```sh
npm test
```