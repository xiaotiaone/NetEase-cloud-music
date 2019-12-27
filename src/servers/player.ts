import { Howl, Howler } from "howler";

const playerlist: Player[] = [];

interface IPlayerOpt {
  src: string;
  onload?: (data: { duration: number }) => void;
  onProgress?: (curDuration: number) => void;
}
export default class Player {
  player: Howl;
  duration!: number;
  progressTimeId!: NodeJS.Timeout;
  constructor({ src, onload, onProgress }: IPlayerOpt) {
    this.player = new Howl({
      src: src,
      autoplay: true,
      onload: () => {
        this.duration = this.player.duration();
        typeof onload === "function" && onload({ duration: this.duration });

        console.log("onload success", this.duration);
      },
      onend: () => {
        console.log("Finished!");
        clearInterval(this.progressTimeId);
      },
      onseek: e => {
        console.log("e", e);
      },
      onloaderror: () => {
        console.log("onloaderror 加载出错了？");
      },
      onplay: () => {
        console.log("onplay ");
        this.progress(onProgress);
        clearInterval(this.progressTimeId);
        this.progressTimeId = setInterval(() => {
          this.progress(onProgress);
        }, 1000);
      }
    });
    this.play();
  }

  init() {}

  pause() {
    this.player.pause();
    clearInterval(this.progressTimeId);
  }

  play() {
    this.player.play();
  }

  // 时间进度变化
  progress(onProgress?: (curDuration: number) => void) {
    const time = this.player.seek() as number;
    typeof onProgress === "function" && onProgress(time);
  }

  static setplayerlist(Player: Player) {
    playerlist.push(Player);
  }
  static getLastInstance(): Player {
    return playerlist[playerlist.length - 1];
  }
}
