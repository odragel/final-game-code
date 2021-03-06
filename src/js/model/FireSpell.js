import {AudioEffect} from "./AudioEffect";
import * as SETTINGS from "../constants/settings";

export class FireSpell {
    constructor(view, ctx, left, top, participant){
        debugger;
        this.view = view;
        this.ctx = ctx;
        this.top = top;
        this.left = left;
        this.participant = participant;

        this.isStopped = 0;
        this.height = SETTINGS.FIRE_SPELL_IMG_HEIGHT;
        this.width = SETTINGS.FIRE_SPELL_IMG_WIDTH;
        this.leftCoord = 0

        this.curFrame = 0;
        this.numOfFrames = SETTINGS.FIRE_SPELL_IMG_FRAMES_AMOUNT;
        this.tickCount = 0;
        this.tickFrame = 6;

        this.deltaX = 0;
        this.isSoundPlayed = 0;

        this.init();
    }

    init(){
        this.img = new Image();
        this.img.src =SETTINGS.FIRE_SPELL_IMG;
        this.img.onload= this.draw.bind(this);
        this.frameWidth = this.width / this.numOfFrames;
        this.sound = new AudioEffect(this.view.fireAudio);
    }

    draw(){
        this.ctx.drawImage(this.img, this.leftCoord + this.frameWidth * this.curFrame , 0, this.frameWidth, this.height,
            this.left, this.top, this.width/this.numOfFrames, this.height);
    }

    clear(){
        this.participant.clear();
        this.ctx.clearRect(this.left, this.top, this.frameWidth, this.height);
    }

    update(resolve, reject){
        this.tickCount++;
        if(this.tickCount > this.tickFrame){
            this.tickCount = 0;
            this.left = this.left + this.deltaX;
            this.curFrame++;
            if(this.curFrame == this.numOfFrames){
                this.sound.stop();
                this.isStopped = 1;
                cancelAnimationFrame(this.animateRef);
                resolve();
            }
        }
    }

    animate(resolve, reject){
        if(!this.isSoundPlayed) {
            this.sound.play();
        }

        this.update(resolve, reject);
        this.clear();
        this.participant.draw();

        if(!this.isStopped){
            this.draw();
            this.animateRef = requestAnimationFrame(this.animate.bind(this, resolve, reject));
        }
    }

}