// .assetpack.js
import { pixiManifest } from '@assetpack/core/manifest';

export default {
    entry: './raw-assets',
    output: './public/assets',
    pipes: [
        pixiManifest({
            output: "manifest.json",
            createShortcuts: false,
            trimExtensions: false,
            includeMetaData: true,
            nameStyle: 'short'
        })
    ],
};