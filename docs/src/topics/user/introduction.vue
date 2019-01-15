<component class="c-page">
    <h1>Welcome to {{app.name}}!</h1>

    <p>
        {{app.name}} lets you communicate privately and freely with your family,
        friends and colleagues via decentralized network SIG11. With {{app.name}},
        you can also receive and make calls on a telephony network when you have
        an account from a compatible VoIP provider.
    </p>

    <h2>Requirements</h2>

    <h3>Compatible Platform</h3>
    <p>
        CA11 runs as a PWA on Android, Linux, Windows, OSX and on Chromebooks.
        The Electron desktop app and the WebExtension can be used on desktop
        Operating Systems (Linux, Windows and OSX). Screensharing only works
        on desktop operating systems.
    </p>

    <h3>A Headset</h3>
    <img class="illustration" src="/screens/alice-wizard-devices.png"/>
    <p>
        The microphone of a laptop/webcam will work, but in order to have
        a good calling experience, it is important to use a proper
        headset with good ergonomics and a decent microphone. There are 3
        types of headsets: Bluetooth, USB and Jack. Bluetooth headsets should
        work just fine in most cases, but there are more situations
        where a bluetooth headset can cause user-related audio issues.
    </p>

    <p>
        While there is not a list of supported headsets, it is generally
        save to say that any decent USB headset should work. Headsets with a
        Jack should also be fine, but those don't show up as a separate device
        in the Devices list, which makes it a bit harder to distinguish the
        device that's going to be used.

        {{app.name}} has a separate device settings screen that shows up during
        the wizard, which you can use to verify your audio settings. The same
        device settings can be found in Settings.
    </p>


    <h3>A webcam</h3>
    <p>
        To make video calls, you need to have a webcam installed on your computer.
    </p>

</component>
