<component class="c-page">
    <h1>Asterisk SFU</h1>
    <p>
    CA11's SIP functionality is developed using Asterisk 16 as backend.
    Installing a PBX like Asterisk can be a bit daunting. On Archlinux,
    a working Asterisk installation can be built like:
    </p>

<pre v-highlightjs>
<code class="bash"># Asterisk installation on Archlinux:
git clone git@github.com:asterisk/asterisk.git
cd asterisk
git checkout 16.1.1
sudo ./contrib/scripts/install_prereq install
sudo pacman -S libsrtp xmlstarlet

./configure
make menuselect
# Add Codec Translators => codec_opus
# Add Core Sound Packages => CORE-SOUNDS-EN-WAV
# Add Extras Sound Packages => EXTRA-SOUNDS-EN-WAV
# Save/Exit
sudo make install
sudo useradd -d /var/lib/asterisk asterisk
sudo vim /etc/sudoers
# Uncomment: %wheel ALL=(ALL) ALL
vim /etc/group
# Add asterisk group to wheel, e.g.: wheel:x:10:root,asterisk
sudo chown -R asterisk:asterisk /etc/asterisk/
sudo chown -R asterisk:asterisk /var/lib/asterisk/
sudo chown -R asterisk:asterisk /var/spool/asterisk/
sudo chown -R asterisk:asterisk /var/log/asterisk/
sudo chown -R asterisk:asterisk /var/run/asterisk/

Generate TLS/DTLS keys for WebRTC support.
# Replace the IP with your own LAN IP.
# Use a dummy pw, like ‘foobar’ when asked for it:
sudo mkdir /etc/asterisk/keys
sudo ./contrib/scripts/ast_tls_cert -C <domainname> -O "ca11" -d /etc/asterisk/keys
# Enter a certificate password x4
cd ..
git clone git@github.com:garage11/ca11-asterisk.git
cd ca11-asterisk
sudo cp * /etc/asterisk
sudo chown -R asterisk:asterisk /etc/asterisk

su asterisk
cd /etc/asterisk
# Change unsecurepassword to a more secure password.
vim pjsip.conf

# Test Asterisk in the foreground
asterisk -cvvvvv
# Everything fine? Start Asterisk in the background.
asterisk
</code>
</pre>

</component>
