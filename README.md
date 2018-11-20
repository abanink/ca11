[![CircleCI](https://circleci.com/gh/garage11/ca11/tree/develop.svg?style=svg)](https://circleci.com/gh/garage11/ca11/tree/develop)

Take me to the [quickstart guide](https://ca11.io/topics/quickstart)


# The Ca11 project
Ca11 is a free-as-in-speech, pluggable communication software project that
focusses on **customization**, **decentralization** and **flexible communication protocols**.
Its philosophy is to empower developers and vendors to build and personalize
their own communication tools at a fast pace, while maintaining flexibility of
opinionated implementation details. Ca11 is written as a readable environment-agnostic
ES2017 codebase that uses a simple but powerful reactive data-oriented design.
This allows it to run in several suitable JavaScript runtimes:

* Blink-compatible browsers (Opera, Chrome, Chromium) as WebExtension or webpage widget
* Electron desktop app
* Node.js runtime

Node.js support is implemented partially. Currently it is usable
for integration tests without having to mock data. Calling functionality
from within a Node.js runtime is not yet supported.


## Customization
From application functionality to the documentation look-and-feel; Ca11 can
easily be branded or customized through the use of plugins that hook into
the core functionality.

<img align="left" src="https://ca11.io/screens/1-alice-login.png" height="200">
<img align="left" src="https://ca11.io/screens/6-alice-wizard-devices.png" height="200">
<img align="left" src="https://ca11.io/screens/9-alice-dialpad-call.png" height="200">
<img align="left" src="https://ca11.io/screens/12-alice-calldialog-outgoing-accepted.png" height="200">


## Decentralization & flexible communication protocols
On the one hand, Ca11 makes use of traditional PBX software and communicates
with it using [SIP-over-websockets](https://sipjs.com/) and WebRTC DTLS-SRTP.
This part is interesting from a telecom perspective, because it taps in to
all of the call features a PBX has to offer: PSTN connectivity, on-hold,
waiting music, transfers, queues, IVR, callgroups, etc.

On the other hand, Ca11 favors a decentralized approach between users where feasible.
A decentralized overlay network is used to act as a signalling layer for users
to setup their p2p WebRTC connections with. This approach is more appropriate
in situations where scalability and/or privacy concerns dictate that (video)
data needs to flow between peers instead of through a centralized service like a
PBX. Another reason to use this signalling protocol is that features like
[chat and file transfers](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel)
are much easier to implement without having to deal with the complexity of
the SIP protocol.

The purpose of Ca11 is not only to facilitate these different use-cases,
but also to integrate them in one unified communication experience for
end-users. A user is entirely free to use any VoIP-service provider with
Ca11, while at the same time being able to communicate p2p with friends
over the decentralized signalling network.


## Want to learn more?
Great! Nice to have you interested in this project. Head over to the [quickstart guide](https://ca11.io/developer/introduction)
to learn more about how to work with Ca11. Are you interested in contributing or
would you like to see some feature implemented? Please read our [code of conduct](https://github.com/garage11/ca11/blob/develop/.github/CODE_OF_CONDUCT.md)
and [contributing guide](https://github.com/garage11/ca11/blob/develop/.github/CONTRIBUTING.md) first.
Have any non-technical questions? Feel free to [contact us](mailto:jeroen@garage11.tech).
