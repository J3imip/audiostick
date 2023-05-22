import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { Path } from 'typescript';
import { promises as fs } from 'fs';
import { File } from 'telegraf/typings/core/types/typegram';
import { logger } from '../winston';

ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);


export class Video {
  private readonly video: File;
  private filePath: Path;
  private cropOptions: string;

  private async getOrientation() {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(this.video.file_path, (err, metadata) => {
        if (err) reject(err);

        const videoStream = metadata.streams.find((stream: any) => stream.codec_type === "video");
        const { width, height } = videoStream;

        if (width > height) {
          // Video is horizontal, crop from left and right
          const cropWidth = height;
          const cropX = (width - height) / 2;
          this.cropOptions = `${cropWidth}:${cropWidth}:${cropX}:0`;
        } else {
          // Video is vertical, crop from top and bottom
          const cropHeight = width;
          const cropY = (height - width) / 2;
          this.cropOptions = `${cropHeight}:${cropHeight}:0:${cropY}`;
        }

        resolve(true);
      });
    });
  }

  public async compress(): Promise<Path> {
    this.filePath = 
      `./src/storage/videos/${this.video.file_unique_id}.mp4` as Path;

    await this.getOrientation();

    return new Promise(async(resolve, reject) => {
      ffmpeg(this.video.file_path)
        .outputFps(30)
        .setDuration("1:00")
        .videoFilters([
          {
            filter: "crop",
            options: this.cropOptions,
          },
          {
            filter: "scale",
            options: "640:640",
          },
        ])
        .on("end", () => {
          resolve(this.filePath);
        })
        .on("err", (err) => {
          reject(err);
        })
        .save(this.filePath);
    });
  }

  public async toVoice(): Promise<Path> {
    this.filePath = `./src/storage/voices/${this.video.file_unique_id}.ogg` as Path;

    return new Promise(async(resolve, reject) => {
      ffmpeg(this.video.file_path) 
        .audioCodec("libopus")
        .audioBitrate("32")
        .toFormat("ogg")
        .output(this.filePath)
        .size('0x0')
        .noVideo()
        .on('end', async() => {
          resolve(this.filePath);
        })
        .on("err", err => {
          reject(err);
        })
        .run();
    })
  }

  public constructor(video: File) {
    this.video = video;
  }

  public async delete() {
    try {
      await fs.rm(this.video.file_path);
      await fs.rm(this.filePath);
    } catch (err) {
      logger.error(err);
    }
  }
};
