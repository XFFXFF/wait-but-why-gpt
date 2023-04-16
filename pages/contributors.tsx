import Head from "next/head";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getPodcasts } from "@/lib/podcasts";
import Link from "next/link";

interface Podcast {
  id: string;
  title: string;
  url: string;
  proofreading: string;
}

export default function FirstPost({ allPostcastsData }) {
  return (
    <>
      <Head>
        <title>得意忘形 GPT</title>
        <meta
          name="description"
          content={`AI-powered search and chat for Zhang Xiaoyu's podcast "得意忘形"`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex h-full w-full max-w-[749px] flex-col px-3 pt-4 sm:pt-8">
            <table className="table-auto">
              <thead>
                <tr className="text-left">
                  <th>播客</th>
                  <th>校对</th>
                </tr>
              </thead>
              <tbody>
                {
                  allPostcastsData.map((podcast: Podcast) => {
                    return (
                      <tr key={podcast.id}>
                        <td>
                          <Link 
                            className="text-blue-600 visited:text-purple-600"
                            href={podcast.url}
                          >
                            {podcast.title}
                          </Link>
                        </td>
                        <td>{podcast.proofreading}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const allPostcastsData = getPodcasts();
  return {
    props: {
      allPostcastsData,
    },
  };
}