# 比特书房提词器

面向中文口播的网页提词器。读到哪，稿件就滚动到哪。也可以切换到匀速滚动。

**[在线使用](https://qihang960812-netizen.github.io/bitstudy-teleprompter/)** · **[下载离线包](https://github.com/qihang960812-netizen/bitstudy-teleprompter/releases/latest/download/bitstudy-teleprompter-web.zip)**

## 在线使用

1. 用 Chrome 或 Edge 打开页面，粘贴稿件、导入 `.txt` 或 `.md`，或者点「填入示例」。
2. 选「语音跟读」，点「开始跟读」并允许麦克风权限。首次跟读会加载约 45 MB 的普通话识别资源。
3. 「一键清空」会清空当前编辑框。误点可立即按 `⌘Z` 或 `Ctrl+Z` 恢复。已经点「存稿件」保存的稿件在「草稿箱」。

从页面的「安装应用」可以查看手机和电脑上的安装方法。浏览器完成页面缓存并加载识别资源后，可以离线跟读。稿件、草稿和录制文件保存在当前浏览器的本地存储中。跟读音频在设备上处理。

## 离线包

1. 下载并解压 `bitstudy-teleprompter-web.zip`。需要 Python 3 和支持麦克风的浏览器。
2. 在解压目录打开终端。macOS 和 Linux 运行 `python3 start.py`，Windows 运行 `py -3 start.py`。
3. 浏览器会打开本地提词器。也可以访问终端显示的地址。关闭终端会停止服务。

离线包自带识别模型，首次打开也可以在断网时跟读。建议使用同一个浏览器和本地地址，方便继续读取已有草稿。

## 第三方组件

语音识别基于 [vosk-browser](https://github.com/lichess-org/vosk-browser) 和 Alpha Cephei 的 [Vosk 普通话模型](https://alphacephei.com/vosk/models.html)。组件授权和修改说明见 [LICENSE](docs/speech/LICENSE.txt) 和 [NOTICE](docs/speech/NOTICE.txt)。
