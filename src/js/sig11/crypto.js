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

        this.ecdh = {
            params: {name: 'ECDH', namedCurve: 'P-256'},
            uses: ['deriveKey', 'deriveBits'],
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
            return await crypto.subtle.generateKey(
                this.rsa.params, true, this.rsa.uses
            )
        } catch (err) {
            // eslint-disable-next-line no-console
            throw err
        }
    }


    /**
    * Import an identity; a base64 stored keypair.
    * @params {Object} keypair - Public and Private key.
    * @returns {Object} - Serializable identity.
    */
    async importIdentity({publicKey, privateKey}) {
        if (!publicKey || !privateKey) throw new Error('invalid keypair')

        let [privateCryptoKey, publicCryptoKey] = await Promise.all([
            crypto.subtle.importKey('jwk', privateKey, this.rsa.params, true, ['sign']),
            crypto.subtle.importKey('jwk', publicKey, this.rsa.params, true, ['verify']),
        ])
        // The crypto.identity property holds both CryptoKeys.
        return {
            privateKey: privateCryptoKey,
            publicKey: publicCryptoKey,
        }
    }


    async serializeIdentity(keypair) {
        const publicKey = await crypto.subtle.exportKey('jwk', keypair.publicKey)
        const id = await this.app.crypto.hash(publicKey.n)
        return {
            headless: this.app.env.isNode,
            id,
            publicKey,
        }
    }


    async serializeKeypair(keypair) {
        let [privateKey, publicKey] = await Promise.all([
            crypto.subtle.exportKey('jwk', keypair.privateKey),
            crypto.subtle.exportKey('jwk', keypair.publicKey),
        ])

        const id = await this.app.crypto.hash(publicKey.n)
        return {id, privateKey, publicKey}
    }


    // async signPubKey(privateKey, publicKey) {
    //     const result = await crypto.subtle.exportKey('raw', keypair.publicKey)

    //     const signed = await crypto.subtle.sign(
    //         {name: this.rsa.params.name, saltLength: 16},
    //         keypair.privateKey,
    //         result,
    //     )

    // }
}

module.exports = CryptoSIG11
