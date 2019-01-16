<component class="c-page">
    <h1>SIP Calling</h1>
    <p>
        CA11 supports receiving and placing video and audio calls over a VoIP network,
        using a SIP-over-WSS and WebRTC backend. WebRTC is still relatively uncharted
        territory for most VoIP providers. Ask your VoIP provider when you're not sure
        about this, or setup your own PBX if you are tech-minded. SIP integration
        needs to be manually enabled from the <em>Settings</em> menu<i class="instruction__ref">1</i>
        at the SIP tab section.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-enable-sip.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The SIP Domain is the address to the WebSocket SIP gateway
            of your provider. The SIP Extension and SIP Password are
            the same credentials you would use for a regular hardphone
            or softphone.
            </div>
        </li>
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-dialing-bob.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            Toggle SIP and saving settings will enable the SIP service.
            SIP calling is active when the SIP status icon in the status
            bar is visible and green. Next, select the Calls menu option
            to view the CA11 keypad. Switch to the SIP protocol,
            type a number and start the call!
            </div>
        </li>

        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-calling-bob.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            Alice is initializing the call to Bob. Bob's phone should
            start ringing or the call may end if he's busy. The call will
            start as soon Bob picks up the phone.
            </div>
        </li>

        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/bob-calling-with-alice.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            This is how the Bob sees the (video)call when its picked
            up. The actual video screen here is from an automated test.
            Normally, this would be the webcam feed of the other user
            in case of a video call.
            </div>
        </li>
    </ol>
</component>
