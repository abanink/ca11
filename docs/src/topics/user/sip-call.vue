<component class="c-page">
    <h1>SIP Calling</h1>
    <p>
    Receiving and placing calls over a VoIP network is optional in CA11,
    and needs to be enabled manually. To do so, you first have to go
    to the <em>Settings</em> menu<i class="instruction__ref">1</i> for SIP.
    SIP calling in CA11 is optional and needs to be enabled first. SIP calling
    is active if the green SIP status icon<i class="instruction__ref">2</i>
    in the status bar is visible.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-enable-sip.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            SIP calling in a browser requires a SIP-over-WSS and
            WebRTC backend. This is still relatively uncharted territory
            for a lot of VoIP providers, especially smaller ones.
            Ask your VoIP provider if you're unsure.
            </div>
        </li>
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-dialing-bob.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            Saving Settings should show the green SIP status icon.
            Then go to the Calls menu option(left) to view the keypad.
            Select SIP protocol, type a number and start a new call.
            </div>
        </li>

        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-calling-bob.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The call is initializing and the other end will start ringing.
            As soon the callee picks up the (video)call, the call will start
            running.
            </div>
        </li>

        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/bob-calling-with-alice.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            This is how the other end sees the (video)call when its picked
            up. The actual video screen here is from an automated test.
            Normally, this would be a webcam feed of the other user.
            </div>
        </li>
    </ol>
</component>
