import { defineStore } from 'pinia';

export const useImageStore = defineStore('imageStore', {
    state: () => ({
        imgList: [
            '',
            {src: new URL('/src/assets/2B_pencil.png', import.meta.url).href},
            {src: new URL('/src/assets/pen.png', import.meta.url).href},
            {src: new URL('/src/assets/pencil.png', import.meta.url).href},
            {src: new URL('/src/assets/laptop.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_white.png', import.meta.url).href},
            {src: new URL('/src/assets/speaker.png', import.meta.url).href},
            {src: new URL('/src/assets/wired_black.png', import.meta.url).href},
            {src: new URL('/src/assets/desktop.png', import.meta.url).href},
            {src: new URL('/src/assets/T-shirt.png', import.meta.url).href},
            {src: new URL('/src/assets/sweater_black.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_white.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_black.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_black.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_white.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_white.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_black.png', import.meta.url).href},
            {src: new URL('/src/assets/iPhone_black.png', import.meta.url).href},
            {src: new URL('/src/assets/pen_white.png', import.meta.url).href},
            {src: new URL('/src/assets/laptop.png', import.meta.url).href},
            {src: new URL('/src/assets/laptop.png', import.meta.url).href},
            {src: new URL('/src/assets/laptop.png', import.meta.url).href},
            {src: new URL('/src/assets/speaker_white.png', import.meta.url).href},
            {src: new URL('/src/assets/wireless_black.png', import.meta.url).href},
            {src: new URL('/src/assets/wired_white.png', import.meta.url).href},
            {src: new URL('/src/assets/wireless_white.png', import.meta.url).href},
            {src: new URL('/src/assets/desktop.png', import.meta.url).href},
            {src: new URL('/src/assets/desktop.png', import.meta.url).href},
            {src: new URL('/src/assets/desktop.png', import.meta.url).href},
            {src: new URL('/src/assets/sweater_black.png', import.meta.url).href},
            {src: new URL('/src/assets/T-shirt_white.png', import.meta.url).href},
        ]
    }),
    actions: {
        setImgList(newImgList) {
            this.imgList = newImgList;
        }
    }
});