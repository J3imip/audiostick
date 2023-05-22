import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { File } from "telegraf/typings/core/types/typegram";
import { Path } from 'typescript';
import { promises as fs } from 'fs';
ffmpeg.setFfmpegPath(ffmpegStatic)

export default async function(
  video: File
): Promise<Path> {
  return new Promise(async(resolve, reject) => {
    const path: Path = `./src/storage/voices/${video.file_unique_id}.ogg` as Path;

    try {
      await fs.access(path);
      resolve(path as Path);
    } catch (err) { }

    ffmpeg(video.file_path) 
      .audioCodec("libopus")
      .audioBitrate("32")
      .toFormat("ogg")
      .output(path)
      .size('0x0')
      .noVideo()
      .on('end', () => {
        resolve(path);
      })
      .on("err", err => {
        reject(err);
      })
      .run();
  })
}
