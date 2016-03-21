import fs from 'fs';
import gulp from 'gulp';

const blacklist = ['index.js', 'utils'];
// 获取定制任务的文件列表
const files = fs.readdirSync('./gulp').filter(f => !blacklist.includes(f));

// 加载定制的任务
files.forEach(function(file) {
    require('./' + file)(gulp);
});

gulp.task('default', ['debugHot']);
