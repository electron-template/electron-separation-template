一个将前端,后端,electron打包,完全抽离的electron模板,
给开发者0electron体验,构建部分全部提到外层,由框架维护,
方便前后端分离开发,

# 问题
1.server端不方便调用electron的api

# 启动项目

- 启动项目
```sh
pnpm installAll
pnpm dev
```

- 新增子模块

```shell

git submodule add -b <子模块分支> <子模块仓库地址> <子模块目录>

```

- 更新子模块

```shell
git submodule update --remote
```

- 删除子模块

```sh
# 清除git缓存
git rm --cached <子模块目录>
# 删除对应子模块目录
rm -rf <子模块目录>
```

# 目录架构
```
node_modules
build            准备用来打包的文件,文件编译后的目录
    main         electron主文件
    server       服务端文件
    renderer     前端文件

scripts         执行命令的脚本,可以自己手动执行
electron        electron相关脚本和预加载文件
renderer        前端页面
server          后端服务

```