try {
    const version = Number(require('vue/package.json').version.split('.')[0]);
    if (version === 2) {
        module.exports = exports = require('./lib/vue2xlib');
    } else if (version === 3) {
        module.exports = exports = require('./lib/vue3xlib');
    }
} catch (error) {
    console.log('[VueThemeManger] '+error);
}