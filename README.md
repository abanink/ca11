[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=svg)](https://circleci.com/gh/garage11/ca11/tree/develop)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Take me to the [quickstart guide](https://ca11.io/topics/quickstart)


# The CA11 project
CA11 is a free communication software project being developed by
tech company [Garage11](https://garage11.tech). Its purpose is to
give people access to **easy-to-use**, **enjoyable**, **free** and **secure** communication. Its goal is to outperform closed CPaaS services with an
open webbased communication solution that also protects people's
privacy in the process.

CA11 may be interesting to people who like a unified communication
experience that enhances their availability. It does this by combining
SIP-based telecom and decentralized p2p calling into one accessable webbased software project that runs on many JavaScript-enabled platforms. CA11 runs as a WebExtension, a PWA and as an Electron app. Node.js support is implemented partially. The project is written as a readable environment-agnostic ES2017 codebase that applies a simple but powerful reactive data-oriented design based on [Vue.js](https://vuejs.org/). This architecture allows it to develop at a
very fast pace while keeping the code maintainable.


## SIG11
CA11 makes use of modern WebRTC-enabled PBX software like Asterisk.
It connects to a PBX using [SIP-over-websockets](https://tools.ietf.org/html/rfc7118)
and DTLS-SRTP(WebRTC) to tap into PBX features like: dialplans,
PSTN connectivity, on-hold, waiting music, transfers, queues, IVRs, callgroups,
conference calls, and recently SFU video-conferencing with Asterisk 16.

On the other hand, CA11 integrates decentralized p2p calling over WebRTC,
because p2p calling is beneficial to users. It has better privacy protection(e2e encryption), worldwide communication is free and it has in most cases the best audio and video quality. This approach works as long both parties use a shared signalling medium to establish the p2p connection.

Yet, nowadays we still mostly depend on proprietary services to setup these communication
channels for us. These services exist, because WebRTC requires a mediator to signal both
parties about their connection setup terms. This raises privacy concerns and is a bad thing for free communication in general. People's communication options are being limited to these proprietary platforms, while - technically - anyone could be able to communicate freely to anyone else, without having to rely on platform X or Y. That is what SIG11 is about, in a nutshell. It envisions a secure, decentralized signalling network and protocol that communication platforms like CA11 can apply, with the purpose to provide user-friendly, free and secure communication to people.


## Want to learn more?
Great! Nice to have you interested in this project.
Feel free to [contact Garage11](mailto:jeroen@garage11.tech)
for more information about SIG11 or CA11. Head over to the [quickstart guide](https://ca11.io/developer/introduction)
to learn more about CA11. Please read the [code of conduct](https://github.com/garage11/ca11/blob/develop/.github/CODE_OF_CONDUCT.md)
and [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md) if you're interested in contributing.
