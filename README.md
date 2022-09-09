# blueprint
Framework for building flow diagrams of your code architecture

## Getting Started
### Installation

1. Requirements: Node 16.x.x, NPM 8.x.x, and GNU Make 4.x.
2. Run installation script `make install`

### View webserver CitiFakeBank example

This example launches a fake banking website at `http://localhost:3000` and a corresponding blueprint UI at `http://localhost:3001`. The blueprint UI explains the code architecture through flow diagrams.

```
cd webserver
npm run examples/citifakebank            #Opens a fake banking website at http://localhost:3000
npm run examples/citifakebank-blueprint  #Opens the blueprint ui at http://localhost:3001
```
