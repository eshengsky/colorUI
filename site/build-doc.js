const path = require('path');
const fs = require('fs');
const showdown = require('showdown');
showdown.extension('headerlink', () => {
    return [{
        type: 'output',
        regex: /(<h(\d) id="(.+)">(.+?))(<\/h\2>)/g,
        replace: (wm, g1, g2, id, g4, g5) => {
            return g1 + ' <a href="#' + id + '"><i class="iconfont icon-pin"></i></a>' + g5;
        }
    }];
});
const converter = new showdown.Converter({
    extensions: ['headerlink'],
    ghCompatibleHeaderId: true
});

let layoutHtml = fs.readFileSync(path.join(__dirname, './layout.html')).toString();

// 生成路径正确的资源文件
const coloruicssLink = path.join(__dirname, '../dist/css/colorui.css');
const doccssLink = path.join(__dirname, './doc.css');
const docjsSrc = path.join(__dirname, './doc.js');
layoutHtml = layoutHtml.replace('$coloruicss', coloruicssLink).replace('$doccss', doccssLink).replace('$docjs', docjsSrc);

const menu = {};
const dirs = fs.readdirSync(path.join(__dirname, './docs/'));

function fn(dir) {
    return new Promise((resolve, reject) => {
        const dirPath = path.join(__dirname, './docs', dir);
        if (!fs.statSync(dirPath).isDirectory()) {
            return resolve();
        }
        menu[dir] = [];
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.error(1, err);
                return reject(err);
            }
            files.forEach(file => {
                if (path.extname(file) === '.md') {
                    const fileName = path.basename(file, path.extname(file));
                    menu[dir].push(fileName);
                    const filePath = path.join(dirPath, file);
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        const html = converter.makeHtml(data.toString());
                        const output = layoutHtml.replace('$body', html);
                        fs.writeFile(path.join(dirPath, `${fileName}.html`), output, err => {
                            if (err) {
                                console.error(err);
                                return reject(err);
                            }
                            resolve();
                        });
                    })
                } else {
                    resolve();
                }
            });
        });
    });
}

function fn2(dir, nav) {
    return new Promise((resolve, reject) => {
        const dirPath = path.join(__dirname, './docs', dir);
        if (!fs.statSync(dirPath).isDirectory()) {
            return resolve();
        }
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                if (path.extname(file) === '.html') {
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }

                        const newData = data.toString().replace('$nav', nav);
                        fs.writeFile(filePath, newData, err => {
                            if (err) {
                                console.error(err);
                                return reject(err);
                            }
                            resolve();
                        })
                    })
                } else {
                    resolve();
                }
            });
        });
    });
}

// html文档已经生成完成了
Promise.all(dirs.map(dir => fn(dir))).then(() => {
    setTimeout(() => {
        // 对menu的属性和值都进行排序
        const keys = Object.keys(menu);
        keys.sort();
        const newMenu = {};
        keys.forEach(key => {
            newMenu[key] = menu[key].sort();
        });

        // 生成左侧目录
        let nav = '';
        Object.keys(newMenu).forEach(key => {
            nav += `<div class="topic-item">
    <a href="">${key.replace(/^\d*/, '')}</a>
    <ul>`;
            newMenu[key].forEach(val => {
                nav += `<li>
            <a href="../${key}/${val}.html">${val.replace(/^\d*/, '')}</a>
        </li>`;
            });
            nav += `</ul></div>`;
        });

        Promise.all(dirs.map(dir => fn2(dir, nav))).then(() => {
            console.log('colorui文档已全部生成！')
        }, err => {
            console.error(`colorui文档生成出错：${err}`);
        });
    }, 100);

}, err => {
    console.error(`colorui文档生成出错：${err}`);
});
