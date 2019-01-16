<component class="c-page">
    <h1>Platforms</h1>
    <h2>CA11 PWA</h2>
    <p>
    CA11 PWA is the default and preferred platform at the moment.
    CA11 Electron and CA11 WebExtension are valid build targets as
    well, but this is the preferred workflow during development. It has
    the fastest development feedback loop. Code automatically rebuilds as
    you make filechanges, while the buildsystem automatically reloads the
    browser using <a href="https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)">
    livereload</a>. Use it whenever you are not developing platform-specific
    code. It can be developed using:
<pre v-highlightjs><code class="bash">gulp develop</code></pre>
    </p>

    <h2>CA11 WebExtension</h2>
    <p>
        A WebExtension can not easily be auto-reloaded during development.
        There is a manual reload option in <code>chrome://extensions/</code> which
        works reliable for the background and foreground script. A slightly faster
        way to reload all cripts is to use <a href="https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid">
        extension reloader</a>.
    </p>
    <h4>Chrome</h4>

<pre v-highlightjs><code class="bash">gulp develop --target chrome</code></pre>
    <p>
        Navigate to <code>chrome://extension</code>, make sure developer mode is enabled,
        and load the directory <code>./build/ca11/chrome</code> as an unpacked extension.
        You can drag-and-drop the distribution zip file from <code>dist/chrome</code> on the
        Chrome extension page, but this may fail on Chrome Windows.
    </p>

    <h4>Firefox</h4>
    <p>
        We would like to have a CA11 WebExtension for Firefox, but WebRTC support in
        Firefox WebExtensions is lacking a <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1278100">
        certain permission handling</a>, that doesn't make it feasible to run CA11
        in Firefox. There is a build target for Firefox WebExtension though,
        in case that this situation changes.
    </p>

<pre v-highlightjs><code class="bash">gulp build --target firefox</code></pre>

    <p>
        Navigate to <code>about:debugging</code> and switch <i>Enable add-on debugging</i> on. Select
        <i>Load Temporary Add-on</i> and point it to the <i>manifest.json</i> file in the <code>build/firefox</code>
        directory.
    </p>

    <h2>CA11 Electron</h2>
    <p>
        CA11 Electron uses the Electron runtime to execute CA11 as a desktop app.
        A compatible Electron version from npm is already installed on your system
        after you installed the dependencies through npm. To make a desktop build:
    </p>

<pre v-highlightjs><code class="bash">gulp build --target electron
./node_modules/electron/dist/electron build/ca11/electron/main.js
</code></pre>
</component>
