<component class="c-page">
    <h1>New Session</h1>
    <p>
        CA11 stores your data stored locally on this computer unless indicated
        otherwise. CA11 uses encrypted local <em>session</em> storage to persist
        application state. This session is protected using the password
        that you provide here. Contacts, activity history, SIP credentials
        and settings; everything is stored in the session.
    </p>
    <p>
        When you open up CA11 for the first time<i class="instruction__ref">1</i>,
        you'll notice it will ask you for a Session Name and a Session Password.
        This is used solely to create and identify a local session on the
        computer that you're using.
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

    <p class="instruction__warn">
        Be aware that removing a session implies removing all of
        your settings, contacts and local activity history as well.

        Session data is stored in a browser's local storage. The CA11
        PWA shares storage with the rest of the browser. Clearing your
        browser history will also remove your CA11 session data.
        This doesn't affect CA11 Electron and CA11 WebExtension.
    </p>
</component>
