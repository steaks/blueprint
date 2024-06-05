# Getting Started

This application has two main directories - server and ui. Edit /server/src/apps/helloWorld.ts and /server/src/apps/helloWorld.tsx to get started. Run your app via:

```
make run-server
make run-ui # Run in separate terminal. Open browser to http://localhost:3000
```

## Installation
Install dependencies in your server and ui via:

```
make install
```

_Note: If you ran the create-blueprint-app script everything will already be installed._

## Build
Build your server and ui via:

```
make build
```
_Note: All changes to the server must be re-built. They are not hotswapped._