import fs from 'fs'
import path from 'path'

const podcastsDirectory = path.join(process.cwd(), 'podcasts')

export const getPodcasts = () => {
  const fileNames = fs.readdirSync(podcastsDirectory)
  const allPodcastsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.txt$/, '')

    const fullPath = path.join(podcastsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const titleMatch = fileContents.match(/title:\s*(.*)/);
    const urlMatch = fileContents.match(/url:\s*(.*)/);
    const proofreadingMatch = fileContents.match(/proofreading:\s*(.*)/);

    const title = titleMatch ? titleMatch[1] : '';
    const url = urlMatch ? urlMatch[1] : '';
    const proofreading = proofreadingMatch ? proofreadingMatch[1] : '';
    return {
      id,
      title,
      url,
      proofreading
    }
  })
  return allPodcastsData
}
    

