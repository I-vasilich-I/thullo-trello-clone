import type { NextPage } from 'next';
import Head from 'next/head';
import SectionHero from 'src/components/SectionHero/SectionHero';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thullo</title>
        <meta name="description" content="Trello clone" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <>
        <SectionHero />
      </>
    </>
  );
};

export default Home;
