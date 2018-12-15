[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=svg)](https://circleci.com/gh/garage11/ca11/tree/develop)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Take me to the [quickstart guide](https://ca11.io/topics/quickstart)


# CA11
CA11 is a free software project being developed by [Garage11](https://garage11.tech). 
Its purpose is to raise the bar of today's communication tools in terms of being open, 
privacy-aware and ubiquitous.

CA11 may be appealing to VoIP-providers who want a headstart in offering their customers a well-designed 
unified communication experience, by building upon a solid, open and extendable software foundation.
CA11 integrates well with modern WebRTC-enabled SIP infrastructure. It uses the [SIP-over-websockets](https://tools.ietf.org/html/rfc7118) protocol as signalling layer and secure DTLS-SRTP(WebRTC) for media streaming, 
making CA11 a full-blown webbased SIP-softphone that can tap into all features a PBX has to offer, like: dialplans,
PSTN connectivity, on-hold, transfers, waiting music, queues, IVRs, callgroups and (SFU video) conference calls.

CA11 may be interesting for businesses who want a powerful and easy-to-use replacement 
for their hardphones. CA11 is easy to integrate with webbased CRM software and can be 
integrated in a company website, adding a powerful and approachable 
communication channel for potential customers to your company.

Consumers may enjoy p2p calling over WebRTC using the decentralized SIG11 signalling network, 
which has better privacy protection through e2e encryption. Worldwide communication over this network 
is free, doesn't require accounts and has the best possible audio and video quality. 
SIG11 is rather an ambitious project and is still in an early phase. 

Developers may like CA11 because the project is written as a readable environment-agnostic ES2017 codebase 
that applies a simple but powerful reactive data-oriented design based on [Vue.js](https://vuejs.org/). This architecture allows CA11 to be developed at a very fast pace while keeping the code maintainable and easy to adapt. 
The project is aimed to be webbased and to be runnable on many JavaScript-enabled platforms. CA11 runs as a 
WebExtension, a PWA and as an Electron app. Node.js support is implemented partially. 


## SIG11?
WebRTC in itself is peer-to-peer, but still requires a signalling channel to setup connections with.
This channel can be a protocol like SIP or a proprietary service that takes care of this. This situation raises 
privacy concerns and is a bad thing for free communication in general. 

Proprietary services have no interest in extending people's communication options outside of their own communication 
platform, while - technically - anyone could be able to communicate freely to anyone else, without having to rely on platform X or Y. That is what the SIG11 project is about in a nutshell. It envisions a secure, decentralized signalling network and protocol that communication tools like CA11 apply, with the purpose to provide user-friendly, free and secure communication to everyone.


## Want to learn more?
Great! Nice to have you interested in this project.
Feel free to [contact Garage11](mailto:jeroen@garage11.tech)
for more information about SIG11 or CA11. Head over to the [quickstart guide](https://ca11.io/developer/introduction)
to learn more about CA11. Please read the [code of conduct](https://github.com/garage11/ca11/blob/develop/.github/CODE_OF_CONDUCT.md)
and [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md) if you're interested in contributing.
