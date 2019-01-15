<component class="c-page">
    <h1>Complete Wizard</h1>
    <p>
        CA11 will show you a wizard welcome screen<i class="instruction__ref">1</i> when you start
        a new session. This wizard goes through the minimal amount of steps to
        get you ready to make your first CA11.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-wizard-welcome.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The welcome screen acts as a landing page for the wizard.
            Nothing special, but you can decide here to go a step back
            and logout if you don't wish to proceed. Proceed with the
            wizard if you want to start calling.
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
