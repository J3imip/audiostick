import ffmpeg from 'fluent-ffmpeg';
import { File } from 'telegraf/typings/core/types/typegram';
import { PassThrough } from 'stream';

export class Video {
  private readonly videoUrl: string;
  private cropOptions: string;
  private videoOrVoicePt: PassThrough;
  private videoOrVoiceBuffer: Buffer;
  private isStick: boolean;

  private async getOrientation() {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(this.videoUrl, (err, metadata) => {
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

  public async compress(): Promise<Buffer> {
    await this.getOrientation();

    return new Promise(async(resolve, reject) => {
      ffmpeg(this.videoUrl)
        .toFormat("mp4")
        .outputFps(30)
        .setDuration("1:00")
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .videoFilters([
          {
            filter: "crop",
            options: this.cropOptions,
          },
          {
            filter: "scale",
            options: "640:640",
          }
        ])
        .on("end", () => resolve(this.videoOrVoiceBuffer))
        .on("error", (err) => reject(err))
        .pipe(this.videoOrVoicePt, { end: true });

      this.videoOrVoiceBuffer = await this.passThroughToBuffer();
    });
  }

  public async toVoice(): Promise<PassThrough> {
    return new Promise(async(resolve, reject) => {
      ffmpeg(this.videoUrl) 
        .audioCodec(this.isStick ? "libopus" : "libmp3lame")
        .audioBitrate("32")
        .toFormat(this.isStick ? "ogg" : "mp3")
        .size('0x0')
        .noVideo()
        .on('end', () => resolve(this.videoOrVoicePt))
        .on("error", err => reject(err))
        .pipe(this.videoOrVoicePt, { end: true });
    })
  }

  private async passThroughToBuffer(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      this.videoOrVoicePt.on('data', chunk => {
        chunks.push(chunk);
      });

      this.videoOrVoicePt.on('error', error => {
        reject(error);
      });

      this.videoOrVoicePt.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
  }

  public constructor(video: File, isStick: boolean = false) {
    this.videoOrVoicePt = new PassThrough();
    this.videoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${video.file_path}`;
    this.isStick = isStick;
  }
};
