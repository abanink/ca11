<component class="c-page">
    <h1>Start Session</h1>
    <p>
        When you start CA11<i class="instruction__ref">1</i>, you'll notice it asks
        for a <em>Session Name</em> and a <em>Session Password</em>.
        This is to store a local <em>session</em> on your computer, which is used
        to keep your data local on your computer.

        CA11 applies encryption on the stored <em>session</em>. Nobody without
        the password provided here, can read your data. Contacts, activity history,
        SIP credentials and settings; everything is stored in the encrypted session.
    </p>

    <ol class="instructions steps">
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-new-session.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            The Session Name and Session Password can be anything;
            just make sure that it is easy for you(and just you)
            to remember.
            </div>
        </li>
        <li class="instruction">
            <div class="instruction__image">
                <img src="/screens/alice-new-session-input.png"/>
            </div>
            <div class="instruction__counter"></div>
            <div class="instruction__text">
            After filling the Session Name and Session Password,
            all you have to do is to click on the <em>Start Session</em>
            button, which will start the initial CA11 setup.
            </div>
        </li>
    </ol>

    <p>
        The default behaviour for a session is <em>Auto-unlock</em>.
        This means that the key to decrypt your data is stored <em>with</em> the
        data, so you don't have to unlock your session after a browser
        restart. You can close the CA11 session manually, by logging out.
        This removes the key and requires you to enter the password again
        on next login.
    </p>

    <p class="instruction__warn">
        Be aware that removing a session implies removing all of
        your settings, contacts and local activity history as well.

        Session data is stored in a browser's local storage. The CA11
        PWA shares storage with the rest of the browser. Clearing your
        browser history will also remove your CA11 session data.
        This doesn't affect CA11 Electron and CA11 WebExtension.
    </p>
</component>
