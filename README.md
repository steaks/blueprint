# blueprint
Framework for building flow diagrams of your code architecture

## Problem

Understanding code architecture is difficult. This challenge translates into inefficient onboarding, slower development, and fewer architect experts.

## Use Cases

Onboarding - A manager of individual contributors would like to explain the architecture of the code in hours rather than weeks.

Delivery - As a technical lead I would like to hand a feature to my ICs and have them quickly understand what parts of the architecture will need to be changed.

Fragility - As a technical lead I want to push products that are not fragile. It is important to have a simple and clear architecture to ensure code quaility.

## Solution

Blueprint - A NodeJS framework that creates a visual flowchart diagram of the code. Developers can leverage the simple and intuitive framework to write self-documenting code that produces flow diagrams of their architecture.

## Guiding Principles

Intuitive - Prefer intuitive over elegant.

Simple - Prefer simple over complex.

Less is More - Prefer fewer features that achieves most cases over many features that accomplish all cases.

## Success Metrics

- An engineering tech lead of ~5 junior to mid-level engineers claims that blueprint made onboarding 30% more efficient for one quarter.

- An engineering tech lead of ~5 junior to mid-level engineers claims that blueprint made feature delivery 30% more efficient for one quarter.

- An engineering tech lead of ~5 junior to mid-level engineers claims that blueprint led to a 10% reduction in shipped bugs.

- An engineering tech lead of ~5 junior to mid-level engineers claims that blueprint did not slow his development time down by more than 10%.

- An engineering tech lead of ~5 junior to mid-level engineers claims that his developers were able to become blueprint users within 2 hours of onboarding.

## Objectives and Key Metrics

[Objectives and Key Metrics](https://docs.google.com/document/d/1TNdooNyGvyNNydvW9fkVBMM3S_ukWkT_R70jLejDSqU/edit)

## User Feedback

[User Feedback](https://docs.google.com/document/d/1zRNCjryqUc2VPq7lAYBrs9-4ny84djHEw_P8bSeM6rY/edit?usp=sharing)

## Getting Started
### Installation

1. Requirements: Node 16.x.x, NPM 8.x.x, and GNU Make 4.x.
2. Run installation script `make install`

### View webserver CitiFakeBank example

This example launches a fake banking account website at `http://localhost:3000` and a corresponding blueprint UI that illustrates the architecture via a flow diagram at `http://localhost:3001`.

```
cd webserver
npm run examples/citifakebank           #Opens a fake website in localhost:3000 that is used for demonstrating blueprint.
npm run examples/citifakebank-blueprint #Opens the blueprint ui in localhost:3001 which displays the code architecture.
```
