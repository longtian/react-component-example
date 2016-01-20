# react-component-example
> 如何使用 ES6 编写一个 React 模块, 并且编译后发布到 NPM.

如果你在使用 React， 那么肯定已经撸了好多自己的组件， 并尝试着共享出来。在 OneAPM 前端开发过程中， 我们也曾遇到了一些组件共享的问题：

例如:

* 是通过 git 直接发布还是通过 NPM 发布 ？
* 发布的是 ES5 的代码还是 ES6 的代码 ？
* 怎么同时发布源代码和编译后的代码 ？
* 如何解决 babel5 和 babel6 的冲突 ？
* 组件的依赖怎么声明，是 devDependecy 还是 dependency ？

这篇文章会通过编写一个叫做 MyComponet 的模块来演示发布一个模块需要注意的地方, 并不涉及单元测试和代码规范等。

前端开发果真是发展迅猛，刚享受到由模块化，组件化和单元测试带来的种种好处，又得迅速拥抱 Grunt, Gulp, Browserify， Webpack 这类自动化工具的变革。

除了工具和生态圈，JavaScript 本身也在飞速发展着。ES2015(ES6) ，ES2016(ES7) ... 照这样的节奏，几乎是一年一个标准。标准多了，为解决兼容性的问题，
竟也派生出了 `源代码` 和 `编译` 的概念。前端开发者通过语法糖、转化器、Polyfill 等，可以享受到标准乃至尚未定稿草案里的规范的便利，大幅提升开发效率。

至于这个模块本身,它的功能特别简单, 就是显示模块自身的的属性。

## 源代码

我们来编写主模块 `MyComponent.jsx` ，放到项目的 `src` 目录下。

```js
import React from 'react';

const MyComponent = props=> {
  return <div>
    props:
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
}

export default MyComponent;
```

关于各种文件放在哪里, 这里是我推荐的一些约定:

* src 下用于存放源代码
* lib 是编译后的代码，这个目录只读
* 所有包含 ES6 语法的文件名统一后缀为 .es6
* 所有包含 JSX 语法的文件后统一缀名为 .jsx

假设源代码里还有另外两个文件 `foo.es6` 和 `bar.js`，简化起见都丢到 `src` 的根目录下。

## 编译

为了把 ES6 代码编译成 ES5，需要安装 Babel，这个工具可以说野心极大，一次编译可以让 JavaScript 运行在所有地方。（听起来是不是有点 Java 的作风）

目前最常用的是 Babel5 版本，但是 Babel6 版本的设计更为精巧，已经非常推荐更新。也正是由于 Babel 有两个版本，所以开发过程中很有可能遇到这样的情况，
模块 A 的开发依赖于 Babel5 版本，而模块 B 依赖于 Babel6 版本。

解决这个问题最好的做法就是把 A 和 B 拆开，独立开发和发布。并且在发布到 NPM 的时候发布是的编译后的，也就是 ES5 版本的代码。

所以如果你的机器上的 `babel` 是全局安装的，是时候卸载它了，因为它的版本不是 5 就是 6 ，会导致一些不可预见的问题。

`npm uninstall babel-cli --global`

正确的安装方式是把 babel-cli 作为 develeopment 的依赖

`npm install babel-cli --save-dev`

如果按照前文的约定来组织代码，`src` 目录结构看起来是这样的

```
src
├── bar.js
├── foo.es6
└── MyComponent.jsx
```

模块所有的代码都在一个目录下，这样编译过程就简单多了，两条命令就可以完成

`./node_modules/.bin/rimraf lib`

`./node_modules/.bin/babel src --copy-files --source-maps --extensions .es6,.es,.jsx --out-dir lib`

输出目录的结构

```
lib
├── bar.js
├── foo.js
├── foo.js.map
├── MyComponent.js
└── MyComponent.js.map
```

具体解释一下各个命令的作用：

第一条命令 `./node_modules/.bin/rimraf lib`

**作用** 编译前清空之前的 lib 目录，这是一个好习惯，可以杜绝对 lib 下的文件的任何手动更改。

第二条命令

`./node_modules/.bin/babel src --out-dir lib --source-maps --extensions .es6,.es,.jsx --copy-files  `

**作用** 遍历 src 目录下的文件，如果后缀名是 .es/.es6/.jsx 中的一种，就编译成 ES5，否则就直接拷贝到输出目录 lib 下

参数详解:

`--out-dir lib` 指定输出目录为 lib

`--extensions .es6,.es,.jsx` 指定需要编译的文件类型

`--copy-files` 对于不需要编译的文件直接拷贝

`--source-maps` 生成 souce-map 文件

编译过程中还隐含了一个步骤就是加载 `.babelrc` 文件里的配置，该文件内容如下

```json
{
  "presets": [
    "es2015",
    "stage-0",
    "react"
  ]
}
```

这是因为 Babel6 采用了插件化的设计，做到了灵活配置：如果要转换 JSX 语法文件，就加上 react 的 preset，同时项目依赖里要添加
`babel-preset-react`

```sh
npm install babel-preset-react --save-dev
```

## 编写样例代码

开发和调试 React 模块目前最好用的打包工具还是 Webpack。在项目跟目录下，新建一个 example 目录：

example/index.html

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
</head>
<body></body>
<script src="bundle.js"></script>
</html>
```

example/src/index.jsx

```js
import React from 'react';
import MyComponent,{foo,bar} from '../../';
import {render} from 'react-dom';

var element = document.createElement("div");
document.body.appendChild(element);
render(<MyComponent name="myComponent"/>, element);
```

webpack.config.js

```js
var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'example', 'src', 'index.jsx'),
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel',
      include: [
        path.join(__dirname, 'example')
      ]
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, 'example')
  }
}
```

**运行样例代码**

```sh
./node_modules/.bin/webpack-dev-server
```

## 发布

发布前，还有一件事就是为你的模块添加一个入口文件 `index.js`

```
module.exports = require('./lib/MyComponent');
exports.default = require('./lib/MyComponent');
exports.bar = require('./lib/bar');
exports.foo = require('./lib/foo');
```

接下来就是发布到 NPM 了。

```
npm publish
```

## 使用

别的开发者在使用你新发布的模块的时候可以这样导入

```
import MyComponent,{foo,bat} from 'react-component-example'
```

导入的直接是 ES5 代码，跳过编译从而避免了出现 Babel 版本不一致的问题，并且速度更快，是不是很棒！

不过假设你的模块包含很多组件，开发者可能只想用其中的一个或某几个，这时可以这样导入：

```
import MyComponent from 'react-component-example/src/MyComponent.jsx'
```

导入的是 ES6 代码，并且会被加入父级项目的编译过程。

## 关于

**本文使用的 babel 版本**

`./node_modules/.bin/babel --version` 6.4.5 (babel-core 6.4.5)

## LICENSE

MIT