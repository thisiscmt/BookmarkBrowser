module.exports.sourceGlobs = {
    scripts    : ['src/**/*.js', 'src/config.js'],
    templates  : ['src/**/*.tpl.html'],
    styles     : ['src/styles/index.less'],
    index      : ['src/index.html']
};

module.exports.buildGlobs = {
    scripts    : ['build/**/*.js'],
    templates  : ['build/**/*.tpl.html'],
    index      : ['build/index.html'],
    all        : ['build/**/*'],
    clean      : ['build/**', '!build', 'build/vendor.js', 'build/vendor.js.map']
};

module.exports.releaseGlobs = {
    clean      : ['release/**']
};

module.exports.vendorScripts = [
    'node_modules/angular/angular.js',
    'node_modules/@uirouter/core/_bundles/ui-router-core.js',
    'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
    'node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
    'node_modules/lodash/lodash.js',
    'node_modules/ngstorage/ngStorage.js'
];

module.exports.vendorCSS = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

module.exports.buildDirectory = 'build';
module.exports.buildAssetsDirectory = 'build/assets';
module.exports.releaseDirectory = 'release';

module.exports.versionFiles = [
    './package.json'
];