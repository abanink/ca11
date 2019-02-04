/**
 * Crypto for the SIG11 protocol. SIG11 depends on WebCrypto and
 * uses public key cryptography to negotiate AES session keys.
 * A user's identity is a RSA keypair. A session to another node
 * is established by creating a transient ECDH keypair, which is
 * signed by the RSA key, so we can verify its origin. This key
 * is used to establish the session's AES key.
 */
class CryptoSIG11 {
    constructor(app) {
        this.app = app
        this.rsa = {
            params: {
                hash: {name: 'SHA-256'},
                modulusLength: 2048,
                name: 'RSA-PSS',
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            },
            uses: ['sign', 'verify'],
        }
    }


    /**
    * Generate the user's identity, which is a RSA keypair. This keypair is
    * used to sign transient ECDH keys, in order to attain PFS.
    * See https://webkit.org/blog/7790/update-on-web-cryptography/
    * @returns {Object} - Serializable identity.
    */
    async createIdentity() {
        try {
            this.identity = await crypto.subtle.generateKey(this.rsa.params, true, this.rsa.uses)
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }

        let [privateKey, publicKey] = await Promise.all([
            this.app.crypto.exportPrivateKey(this.identity.privateKey),
            this.app.crypto.exportPublicKey(this.identity.publicKey),
        ])

        const id = await this.app.crypto.hash(publicKey)
        return {id, privateKey, publicKey}
    }


    /**
    * Import an identity; a base64 stored keypair.
    * @params {Object} keypair - Public and Private key.
    * @returns {Object} - Serializable identity.
    */
    async importIdentity({publicKey, privateKey}) {
        try {
            let [privateCryptoKey, publicCryptoKey] = await Promise.all([
                this.app.crypto.importPrivateKey(privateKey, this.rsa.params, ['sign']),
                this.app.crypto.importPublicKey(publicKey, this.rsa.params, ['verify']),
            ])
            // The crypto.identity property holds both CryptoKeys.
            this.identity = {
                privateKey: publicCryptoKey,
                publicKey: privateCryptoKey,
            }
            const id = await this.app.crypto.hash(publicKey)
            return {id, privateKey, publicKey}
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`${this}unable to decrypt rsa identity`)
            throw err
        }
    }
}

module.exports = CryptoSIG11
