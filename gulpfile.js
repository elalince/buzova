import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';
import { copy } from './gulp/tasks/copy.js';
import { fonts } from './gulp/tasks/fonts.js';
import { html } from './gulp/tasks/html.js';
import { images } from './gulp/tasks/images.js';
import { js } from './gulp/tasks/js.js';
import { reset } from './gulp/tasks/reset.js';
import { scss } from './gulp/tasks/scss.js';
import { server } from './gulp/tasks/server.js';
import { svgSpriteTask } from './gulp/tasks/svgicons.js';

const isBuild = process.argv.includes('--build');

globalThis.app = {
    gulp,
    path,
    plugins,
    isBuild,
    isDev: !isBuild
};

const buildAssets = gulp.parallel(html, scss, js, images, copy, fonts);

function watchFiles() {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.fonts, fonts);
}

export const build = gulp.series(reset, buildAssets);
export const dev = gulp.series(buildAssets, server, watchFiles);
export { svgSpriteTask };
export default dev;