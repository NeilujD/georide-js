// To run it: `EMAIL=<your_georide_email_address> PASSWORD=<your_georide_password> node ./example.mjs

const Georide = require('./dist/cjs/georide').default


const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD

const main = async () => {
  // Create the client
  const client = new Georide(EMAIL, PASSWORD)
  // Authenticate the user
  const token = await client.login()

  const info = await client.User.info()
  console.log(info)

  // Subscribe to the `position` event
  client.onPosition(message => {
    console.log(message)
    const { trackerId, latitude, longitude, moving } = message
  })
}

main()