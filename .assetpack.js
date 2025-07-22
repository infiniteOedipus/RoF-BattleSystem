// .assetpack.js
import { pixiPipes } from '@assetpack/core/pixi';

export default {
    entry: './raw-assets',
    output: './public/assets',
    pipes: [
        pixiPipes({
        cacheBust: true,
        resolutions: { default: 1, low: 0.5 },
        compression: { jpg: false, png: true, webp: true },
        texturePacker: { nameStyle: "short" },
        audio: {},
        manifest: { createShortcuts: true },
        })
    ],
};