wget https://raw.githubusercontent.com/cdnss/pupet/main/ngrok.py
chmod +x ngrok.py
python ngrok.py
echo Please wait for installing new 10...
sudo apt update -y > /dev/null 2>&1
echo "Installing QEMU (2-3m)..."
sudo apt install qemu-system-x86 curl -y > /dev/null 2>&1
echo Downloading Windows Disk...
#curl -L -o w10x64.img https://bit.ly/akuhnetW10x64
echo "Windows 10 x64 Lite On Google Colab"
echo Your VNC IP Address:
curl --silent --show-error http://localhost:4040/api/tunnels | sed -nE 's/.*public_url":"tcp:..([^"]*).*/\1/p'
echo "Note: Use Right-Click Or Ctrl+C To Copy"
echo "Please Keep Colab Tab Open, Maximum Time 12h"
echo Script by fb.com/thuong.hai.581
echo Starting Windows xxxz...
sudo qemu-system-x86_64 -vnc :0 -hda w10x64.img -smp cores=2 -m 8096M -machine usb=on -device usb-tablet
