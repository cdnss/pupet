sudo apt update -y
sudo apt install qemu qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils virt-manager

docker run -it \
    -e CPU=Penryn \
    -e ENABLE_KVM=' ' \
    -e KVM=' ' \
    -e CPUID_FLAGS=' ' \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e "DISPLAY=${DISPLAY:-:0.0}" \
    -v "${PWD}/android.qcow2:/home/arch/dock-droid/android.qcow2" \
    -p 5555:5555 \
    sickcodes/dock-droid:latest
