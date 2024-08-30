import { parseFile } from 'music-metadata';
import fs from 'fs'
import path from 'path'

const workDir = '/Users/rungsikorn/Music/Sandbox'

async function iterateDirectory(dirPath) {
    let musicPaths = []
    // Read the contents of the directory
    const entries = await fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            // If the entry is a directory, recursively iterate through it
            const nested = await iterateDirectory(fullPath);
            musicPaths = musicPaths.concat(nested)
        } else if (entry.isFile()) {
            // If the entry is a file, log its path or do something else with it
            if (path.extname(fullPath) !== '.m4a') {
                continue;
            }
            musicPaths.push(fullPath)
        }
    }

    return musicPaths;
}

async function parseMeta(trackpaths) {
    const metas = await Promise.all((trackpaths.map(async (trackpath) => {
        const meta = await parseFile(trackpath)
        console.log('parse: ' + trackpath)
        if (!meta.common.title) {
            console.error('invalid meta', meta)
            throw new Error('ERROR')
        }
        return meta;
    })));
    return metas;
}
async function metaIndexer() {

    let allMusicPaths = await iterateDirectory(workDir + '/Music');
    // allMusicPaths = allMusicPaths.slice(0, 100)
    const batchSize = 20;
    let metas = [];
    for (let i = 0; i < allMusicPaths.length - 1; i += batchSize) {
        metas = metas.concat(await parseMeta(allMusicPaths.slice(i, i + (batchSize - 1))));
    }

    await fs.writeFileSync(path.join(workDir, './rating.json'), JSON.stringify(metas.map(meta => {
        return {
            title: meta.common.title,
            artist: meta.common.artist,
            album: meta.common.album,
        }
    })), {})
    return
}

async function run() {
    await metaIndexer();

    const clientId = 'e4fcc26e70b24b87960a9696b274404b'
    const clientSecret = '2aa321549f1844fa9985e3d821cd8c66'
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');

    const url = 'https://accounts.spotify.com/api/token'
    const authResponse = await fetch(url, {
        method: 'post',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data,
    });
    const authResponseJson = await authResponse.json();


    const metaIndexFile = (await fs.readFileSync(path.join(workDir, './rating.json'), 'utf-8')).toString()
    const metaIndex = JSON.parse(metaIndexFile);

    for (const track of metaIndex) {

        const album = track.album
        const artist = track.artist
        console.log(track)
        console.log(album, artist)
        const statsPath = path.join(workDir, `./${artist}-${album.replace(/\//g, '-')}.json`);
        const isLoaded = await fs.existsSync(statsPath);
        if (isLoaded) {
            continue;
        }
        console.log(`grab data for ${statsPath}`)
        const searchParam = new URLSearchParams();
        searchParam.append('q', `album:${album} artist:${artist},`)
        searchParam.append('type', 'track')
        searchParam.append('market', 'TH')
        const searchUrl = 'https://api.spotify.com/v1/search?' + searchParam.toString()

        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${authResponseJson.access_token}`,
            }
        });
        try {
            const searchResponseJson = await searchResponse.json();
            const items = searchResponseJson.tracks.items
            await fs.writeFileSync(statsPath, JSON.stringify({ tracks: items }))
            await sleep(500)
        }catch(e) {
            console.error("meta error", e)
            console.error(searchResponse.status)
            console.error(searchResponse.text())
        }
    }
}

function sleep(n) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), n)
    })
}

run();

