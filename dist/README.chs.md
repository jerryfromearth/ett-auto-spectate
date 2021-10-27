# Eleven Table Tennis 自动观战

这是一个在电脑上运行的程序。它可以让电脑版的ETT自动追踪进入VR设备的ETT所在的房间，从而实现自动观战。

示例: https://www.bilibili.com/video/BV1jR4y1H7gf

## 准备工作

(备注：目前没有Mac版ETT。所以Mac用户需要在虚拟机里做这些步骤)

1. 安装电脑版的Eleven Table Tennis（如果你已经有Oculus版的ETT，可以在Oculus电脑客户端里免费下载电脑版ETT（需翻墙）。也可以在Steam上购买下载ETT（不需翻墙））。

2. 双击电脑版ETT的安装目录里的 `ElevenStartJust2d.bat` 文件，从而以2D模式运行电脑版的ETT.

   1. 如果游戏没有在全屏模式下运行，按 `alt+enter` 键让它变成全屏。

   2. 调整镜头角度到你想观战的角度。(WASDQE 移动位置, 鼠标右键旋转镜头）
      然后用 `左shift+8` 来保存这个角度。之后自动观战程序会按8来调出这个角度。

   3. 关闭电脑版的ETT。

3. 如果你的电脑跑的是Windows：
   
   1. 从 https://github.com/jerryfromearth/ett-auto-spectate/releases 下载最新的exe程序，把它保存到任何地方。

   2. 在exe程序所在目录创建一个 `username.txt` 文本文件，把你的ETT的主账号名字写在里面。保存。

4. 如果你的电脑跑的是Linux：

   1. 安装Python3 (https://www.python.org/downloads/)

   2. 下载最新的源码 https://github.com/jerryfromearth/ett-auto-spectate/releases/, 保存到任何地方。

   3. 在`ett-auto-spectate`目录里创建一个 `username.txt` 文本文件，把你的ETT的主账号名字写在里面。保存。

   4. 运行 `pip install -r requirements.txt`来安装需要的库。

## 运行自动观战程序

1. 确保VR设备没有连接到电脑。在VR设备上启动 ETT，单击“确定”，并确保它至少已加载好友列表。

1. 暂时摘下VR设备。接下来的步骤要在电脑上进行。
   
   双击**电脑ETT安装文件夹**中的`ElevenStartJust2d.bat`文件，以2d运行游戏。如果它不使用全屏，请按 `alt + enter`。（由于您的主ETT账号已经在VR设备里登录，所以电脑版会使用“主账号名\_guest”账号登录。）
   
   小心，不要改变电脑上的镜头角度！

   1. 确保“主账号名\_guest”帐户有且只有一个朋友，即您的主帐户（在VR设备上运行）。没有的话，让他们互相加为好友。

2. 运行 `ett-auto-spectate.exe`（如果你在 Windows 上），或在 `ett-auto-spectate` 文件夹中执行 `python ett-auto-spectate.py`（如果你不是在 Windows 上）。如果所有检查都通过，脚本应该输出类似“Waiting until user <your-user-name> is in a room...”之类的内容。如果您只有一台显示器，请最小化脚本窗口。否则请确保它不在主监视器上。

3. 再次确保电脑版ETT正在主显示器上全屏运行。它前面不应该有其他窗口遮挡。

4. 戴上VR设备开始玩ETT。现在当你进入任何房间的时候，电脑版ETT会在5到10秒后自动加入（你可以在右侧的“房间用户列表”中看到它）。当你离开房间的时候，电脑版ETT也会在5到10秒后离开。

   注意：加入房间后，请务必等待 5-10 秒（利用时间与对手打招呼等等），让电脑版ETT 有足够的时间加入房间，然后再选择比赛类型。如果它在比赛期间加入房间，可能会发生故障（可能需要重置球来解决故障）。

为了简化整个流程，我编写了这个 Windows 批处理文件（显然，您需要编辑路径）：

```
cd /D G:\Oculus\Software\Software\for-fun-labs-eleven-table-tennis-vr
call ElevenStartJust2d.bat

cd /D E:\obs-studio\bin\64bit\
start obs64.exe --startrecording --minimize-to-tray

timeout 20

cd /D C:\Users\Jerry\Desktop\ETT\ett-auto-spectate
start ett-auto-spectate.exe
```

所以，每次我的流程是：在VR里启动ETT，点击确定，完成登录 -> 运行Windows批处理文件 -> 回到VR开始玩ETT。


## Contact

如有问题，请联系作者。

## Recomendation

如果需要录像的话，我推荐用OBS。在OBS里可以在录像里实时叠加比分界面。具体看这里 https://github.com/Cristy94/eleven-vr-scoreboard

## TODO

- Exit room only works when a match has ended
- Make other resolutions work
- Write more instructions
- OCR the texts
- Handle the case when spectator is kicked out from the room (don't rejoin)
- Enable ping ball?
