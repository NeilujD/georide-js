// To run it: `EMAIL=<your_georide_email_address> PASSWORD=<your_georide_password> node ./example.mjs

const Georide = require('./dist/cjs/georide').default


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
  // Share a trip
  const { url, shareId } = await client.Tracker.shareTrip(myTrackerId, {tripId: trips[0].id})
  // Subscribe to the `position` event
  client.onPosition(message => {
    console.log(message)
    const { trackerId, latitude, longitude, moving } = message
  })

  process.exit()
}

main()
