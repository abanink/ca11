<component class="c-page">
    <h1>Plugins</h1>
    <p>
        CA11 has several options to be customized. The color palette in <code>.ca11rc</code>
        can be changed to match a custom brand. The theme is a
        <a href="https://github.com/garage11/ca11-theme-default">seperate repository</a> that
        can be swapped out, to include your own branded files. Eventually, all brand-related
        material will be supplied from a separate theme project, which makes it quite
        easy to adapt a new brand.

        CA11 also has an experimental plugin system. In <code>.ca11rc</code> there is a
        section that references plugins which are used to add custom functionality
        to your build. The <em>builtin</em> plugins are existing core plugins that
        can be augmented by using a custom <i>adapter</i>, a <i>provider</i> or <i>addon</i>.
        Custom plugins are whole new plugins that can be added to CA11's functionality.
        The source-code is your friend here, because the plugin system itself is still
        pretty much in flux:
    </p>

<pre v-highlightjs><code class="json">"plugins": {
    "builtin": {
        "contacts": {
            "i18n": ["ca11-provider-contacts-customname"],
            "providers": ["ca11-provider-contacts-customname"]
        }
    },
    "custom": {
        "queues": {
            "name": "ca11-custom-mod",
            "parts": ["bg", "fg", "i18n"]
        }
    }
}
</code></pre>

    <p>
        A handy trick to test API-calls during development without the need for CORS:
    </p>
<pre v-highlightjs><code class="bash"># --ignore-certificate-errors may be useful in certain cases as well.
chromium --disable-web-security --user-data-dir=~/.chromium-temp
# Visit localhost:3000 to see the built webview.
</code></pre>
</component>
