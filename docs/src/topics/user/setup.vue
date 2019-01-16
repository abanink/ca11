<component class="c-page">
    <h1>Initial Setup</h1>
    <p>
        CA11 shows you a wizard welcome screen<i class="instruction__ref">1</i>
        just after you started a new session. This wizard guides you through
        the minimal amount of setup steps to make your first SIG11 call. SIP
        calling is currently not part of the wizard, because this requires
        an account from a compatible VoIP-provider.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-wizard-welcome.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The welcome screen is the landing page of the Wizard.
            You can decide here to go a step back and close the session
            if you are not sure if you wish to proceed. Proceed with the
            wizard if you want to setup CA11.
            </div>
        </li>
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-wizard-media-permission.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            This wizard step checks if {{app.name}} has permission to use
            the microphone and webcam of your computer. Check the browser
            navigation bar in case it indicates no permission.
            </div>
        </li>

        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-wizard-devices.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The welcome is just there to inform you about
            what is going to happen next.
            </div>
        </li>
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-wizard-telemetry.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The welcome is just there to inform you about
            what is going to happen next.
            </div>
        </li>
    </ol>
</component>
