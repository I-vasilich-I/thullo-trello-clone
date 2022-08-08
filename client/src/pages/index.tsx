import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thullo</title>
        <meta name="description" content="Trello clone" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main>
        <h1>
          Welcome to Thullo - Trello clone
        </h1>
      </main>
    </>
  )
}

export default Home
