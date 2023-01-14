const ytdl = require('ytdl-core');
const urlLib = require('url');
const https = require('https');
const fs = require('fs');

const HEAD = 'HEAD';
const CONTENT_LENGTH = 'content-length';



async function downloadVideo(req, res) {
    try {
        const format = req.query.format || 'mp4';
        const resolution = req.query.quality;
        const url = `https://www.youtube.com/watch?v=${req.query.idVideo}`;
        const videoInfo = await ytdl.getInfo(url);
        const videoFormats = videoInfo.formats.filter(x => x.hasAudio && x.hasVideo &&
            x.container === format && x.qualityLabel === resolution);


        res.header('Content-Disposition', `attachment; filename=teses.${format}`);
        ytdl(videoFormats[0].url, { format, resolution }).pipe(res);
    } catch (error) {
        res.send(error);
    }
}



/**
 * Fetches details for a given YouTube video.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
async function getDetailsVideo(req, res) {
    // Validate input
    if (!req.body.url || !isValidYouTubeUrl(req.body.url)) {
        return res.status(400).send('Invalid YouTube URL');
    }
    const url = req.body.url;
    let videoInfo;
    try {
        videoInfo = await ytdl.getInfo(url);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to fetch video info');
    }

    const videoFormats = videoInfo.formats.filter(x => x.hasAudio && x.hasVideo);
    const formattedFormats = await Promise.all(
        videoFormats.map(async videoFormat => ({
            format: videoFormat.container,
            quality: videoFormat.qualityLabel,
            size: (await getSize(videoFormat.url) / 1000000),
            loading: false
        }))
    );

    res.json({
        formats: formattedFormats,
        title: videoInfo.player_response.videoDetails.title,
        idVideo: videoInfo.player_response.videoDetails.videoId,
        thumbnail: videoInfo.player_response.videoDetails.thumbnail.thumbnails.slice(-1)[0].url,
        viewCount: videoInfo.player_response.videoDetails.viewCount,
        dutation: `${Math.floor(videoInfo.player_response.videoDetails.lengthSeconds / 3600)} : ${(videoInfo.player_response.videoDetails.lengthSeconds % 3600 / 60).toFixed(2)}`

    });
}

/**
 * Determines whether the given string is a valid YouTube URL.
 * 
 * @param {string} url - The URL to validate
 * @returns {boolean}
 */
function isValidYouTubeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname === 'www.youtube.com';
    } catch (error) {
        return false;
    }
}

/**
 * Gets the size of the resource at the given URL.
 * 
 * @param {string} url - The URL of the resource
 * @returns {Promise<number>}
 */
async function getSize(url) {
    return new Promise((resolve, reject) => {
        const parsed = urlLib.parse(url);
        parsed.method = HEAD;
        https.request(parsed, res => {
            resolve(res.headers[CONTENT_LENGTH]);
        }).end();
    });
}

module.exports = {
    getDetailsVideo,
    downloadVideo

};