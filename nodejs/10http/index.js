const fs = require('fs');
const game = require('./game')
const express = require('express');

const koa = require('koa');
const mount = require('koa-mount')

// 玩家胜利次数，如果超过3，则后续往该服务器的请求都返回500
var playerWinCount = 0
// 玩家的上一次游戏动作
var lastPlayerAction = null;
// 玩家连续出同一个动作的次数
var sameCount = 0;

const app = new koa();

app.use(
    mount('/favicon.ico', function (ctx) {
        // koa比express做了更极致的response处理函数
        // 因为koa使用异步函数作为中间件的实现方式
        // 所以koa可以在等待所有中间件执行完毕之后再统一处理返回值，因此可以用赋值运算符
        ctx.status= 200;
        
    })
)

// const app = express();

// // 通过app.get设定 /favicon.ico 路径的路由
// // .get 代表请求 method 是 get，所以这里可以用 post、delete 等。这个能力很适合用于创建 rest 服务
// app.get('/favicon.ico', function (request, response) {
//     // 一句 status(200) 代替 writeHead(200); end();
//     response.status(200)
//     return;
// })
const gameKoa = new koa();
app.use(
    mount(
        '/game',
        gameKoa
    )
)
gameKoa.use(
    async function (ctx, next) {
        ctx.set("Access-Control-Allow-Origin", "*");
        if (playerWinCount >= 3 || sameCount == 9) {
            ctx.status = 500
            ctx.body = '我不会再玩了！'
            return;
        }
        
        // 使用await 关键字等待后续中间件执行完成
        await next();

        // 就能获得一个准确的洋葱模型效果
        if (ctx.playerWon) {
            playerWinCount++;
        }
    }
)
gameKoa.use(
    async function (ctx, next) {
        ctx.set("Access-Control-Allow-Origin", "*");
        const query = ctx.query;
        const playerAction = query.action;

        if (!playerAction) {
            ctx.status = 400;
            return;
        }

        if (lastPlayerAction == playerAction) {
            sameCount++
            if (sameCount >= 3) {
                ctx.status = 400;
                ctx.body = '你作弊！我再也不玩了';
                sameCount = 9
                return;
            }
        } else {
            sameCount = 0;
        }
        lastPlayerAction = playerAction;

        ctx.playerAction = playerAction
        await next();
    }
)
gameKoa.use(
    async function (ctx) {
        const playerAction = ctx.playerAction;
        const result = game(playerAction);
        // 对于一定需要在请求主流程里完成的操作，一定要使用await进行等待
        // 否则koa就会在当前事件循环就把http response返回出去了
        await new Promise( resolve => {
            // 模拟500毫秒后才返回的现象。
            setTimeout(()=> {
                ctx.status = 200;
                if (result == 0) {
                    ctx.body = '平局';
                } else if (result == -1) {
                    ctx.body = '你输了';
                } else {
                    ctx.body = '你赢了';
                    ctx.playerWon = true;
                }
                resolve()
            }, 500)
        })
        
    }
)

// 设定 /game 路径的路由
// app.get('/game',

//     function (request, response, next) {
//         response.header("Access-Control-Allow-Origin", "*");
//         if (playerWinCount >= 3 || sameCount == 9) {
//             response.status(500);
//             response.send('我不会再玩了！');
//             return;
//         }
        
//         // 通过next执行后续中间件（同步的）
//         next();

//         // 当后续中间件执行完之后，会执行到这个位置
//         if (response.playerWon) {
//             playerWinCount++;
//         }
//     },

//     function (request, response, next) {
//         response.header("Access-Control-Allow-Origin", "*");
//         // express自动帮我们把query处理好挂在request上
//         const query = request.query;
//         const playerAction = query.action;

//         if (!playerAction) {
//             response.status(400);
//             response.send();
//             return;
//         }

//         if (lastPlayerAction == playerAction) {
//             sameCount++
//             if (sameCount >= 3) {
//                 response.status(400);
//                 response.send('你作弊！我再也不玩了');
//                 sameCount = 9
//                 return;
//             }

//         } else {
//             sameCount = 0;
//         }
//         lastPlayerAction = playerAction;

//         // 把用户操作挂在response上传递给下一个中间件
//         response.playerAction = playerAction
//         next();
//     },

//     function (req, response) {
//         const playerAction = response.playerAction;
//         const result = game(playerAction);
        
//         // 如果这里执行setTimeout，会导致前面的洋葱模型失效
//         // 因为playerWon不是在中间件执行流程所属的那个事件循环里赋值的
//         // setTimeout(()=> {
//             response.status(200);
//             if (result == 0) {
//                 response.send('平局')

//             } else if (result == -1) {
//                 response.send('你输了')

//             } else {
//                 response.send('你赢了')
//                 response.playerWon = true;

//             }
//         // }, 500)
//     }
// )
// app.use(
//     mount('/', function (ctx) {
//         ctx.body = fs.readFileSync(__dirname + '/index.html', 'utf-8')
//     })
// )
// app.get('/', function (request, response) {
//     // send接口会判断你传入的值的类型，文本的话则会处理为text/html
//     // Buffer的话则会处理为下载
//     response.send(
//         fs.readFileSync(__dirname + '/index.html', 'utf-8')
//     )
// })

app.listen(3000);

// http
//     .createServer(function (request, response) {
//         // 通过内置模块url，转换发送到该http服务上的http请求包的url，(已过时)
//         // 将其分割成 协议(protocol)://域名(host):端口(port)/路径名(pathname)?请求参数(query)

//         // 2021年更新：此处nodejs最新版已经建议改用URL对象解析。
//         const parsedUrl = new URL(request.url, "http://whatever.com");

//         // 浏览器所有对这个服务器的请求，都会走到这个http.createServer的回调函数里
//         // 所以这里对不同的请求url做判断，就可以处理不同url的请求的返回

//         if (parsedUrl.pathname == '/favicon.ico') {
//             // 如果请求url是浏览器icon，比如 http://localhost:3000/favicon.ico的情况
//             // 就返回一个200就好了
//             response.writeHead(200);
//             response.end();
//             return;
//         }

        
//         if (parsedUrl.pathname == '/game') {
//             // 如果请求url是游戏请求，比如 http://localhost:3000/game?action=rock的情况
//             // 就要把action解析出来，然后执行游戏逻辑

//             // 2021年更新：此处nodejs最新版已经建议改用URL对象解析。
//             const query = parsedUrl.searchParams;
//             const playerAction = query.get('action');

//             // 如果统计的玩家胜利次数超过3
//             // 或者玩家出现过作弊的情况（sameCount=9代表玩家有过作弊行为）
//             if (playerWon >= 3 || sameCount == 9) {
//                 response.writeHead(500);
//                 response.end('我再也不和你玩了！');
//                 return
//             }

//             // 当玩家操作与上次相同，则连续相同操作统计次数+1，否则统计清零
//             // 当玩家操作连续三次相同，则视为玩家作弊，把sameCount置为9代表有过作弊行为
//             if (playerLastAction && playerAction == playerLastAction) {
//                 sameCount++;

//             } else {
//                 sameCount = 0;
//             }
//             playerLastAction = playerAction

//             if (sameCount >= 3) {
//                 response.writeHead(400);
//                 response.end('你一直出同一种拳，你作弊！');
//                 sameCount = 9;
//                 return 
//             }

//             // 执行游戏逻辑
//             const gameResult = game(playerAction);

//             // 先返回头部
//             response.writeHead(200);

//             // 根据不同的游戏结果返回不同的说明
//             if (gameResult == 0) {
//                 response.end('平局！');

//             } else if (gameResult == 1) {
//                 response.end('你赢了！');
//                 // 玩家胜利次数统计+1
//                 playerWon++;

//             } else {
//                 response.end('你输了！');

//             }
//         }

//         // 如果访问的是根路径，则把游戏页面读出来返回出去
//         if (parsedUrl.pathname == '/') {
//             fs.createReadStream(__dirname + '/index.html').pipe(response);
//         }
//     })
//     .listen(3000)