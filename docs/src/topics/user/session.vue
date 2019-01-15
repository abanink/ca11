<component class="c-page">
    <h1>Begin Session</h1>
    <p>
        CA11 is a softphone software project; not a cloud service that
        collects your data. Your personal data belongs to you. Instead
        of storing data on a cloud service, your data is stored encrypted
        in a vault on this computer.
    </p>
    <p>
        CA11 uses a concept of a <em>session</em> to store its data in.
        Contacts, Activities, SIP credentials and Settings are all
        stored in that session. Don't worry, it is easy to use!
        When you open up CA11 for the first time<i class="instruction__ref">1</i>,
        you'll see it will ask you for a username and a password.
        This is not to log you in to a service, but to create and identify
        a local vault on your computer. The username/password can be any
        combination; just make sure that it is easy for you(and just you)
        to remember.
    </p>

    <p class="instruction__note">
        The default behaviour for a session is <em>Remember Session</em>.

        This stores the local data encryption key along with the data, allowing
        auto-login without a password. This key is removed when you quit CA11
        with the quit button. You can optionally disable auto unlock to force
        a password unlock action after a restart of the browser.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-new-session.png"/>
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
                <img src="/screens/alice-new-session-input.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            This wizard step checks if {{app.name}} has permission to use
            the microphone and webcam of your computer. Check the browser
            navigation bar in case it indicates no permission.
            </div>
        </li>
    </ol>

    <p class="instruction__warn">
        Be aware that removing a session means that it will remove ALL of
        your settings. Localstorage data is also removed when you use CA11
        as a PWA, and you decide to clear all browser data.
        There is no way at the moment to backup or import this data at
        the moment...
    </p>


</component>
