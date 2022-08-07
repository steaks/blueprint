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

## Getting Started
### Installation

1. Requirements: Node 16.x.x or NPM 8.x.x
2. Run installation script `make install`

### View general purpose code examples

```
cd examples
npm run build
npm run blueprint
```

### View webserver examples

```
cd webserver
npm run helloworld
npm run helloworld-blueprint
```
