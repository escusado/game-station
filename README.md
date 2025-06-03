# DINOTaG

## Drop In-N'-Out Table Games

# Overview

A web based gaming experience tailored for local multiplayer gaming experiences
for Ad opportunities and licenced content placement.
Designed for low friction drop-in and drop-out, using LiveKit stack for input
handling from customer device to shared screen allows for easy join to ongoing
games.

# Problem

The experience calls for very specific constraints and assumptions, the product
looks to be deployed on a shared spaced where Ad opportunities are disired:
restaurans, bars, etc. we should assume reliable internet and power.

## Assumptions

Venue environment:

- Shared screens easily visible to small groups
- Computing power enough to run basic 3D graphics for each screen

Customer device:

- Modern web smartphone with internet connection.

## Constraints

- Low friction on participating on a group game, we want to avoid:
  - Manual link/socials capture
  - Cold Wifi joining
  - Account creation

# Solution Proposal

A web based game platform where users can use their own phones or tables as
input devices as if you plugged your controller to the console where everyone
is playing.

## Overview

A web based solution capable of running on existing reasonably modern hardware
like RaspberryPi like devices or old computers, tablets or phones; where theres
a web browser already installed.

Likewise for the customer joining, most probably their device already has a web
broser and internet connection on it, so aming for a web solution also makes
sense.

The LiveKit infrastructure to make the joining experience a one-click action for
the customer, carrying the input data through the internet to the local device
at the venue.

A web solution allows for solutions like Unity for robust game development
projects or THREE.js for more experimental indeas like this one.

Given that we're developing a very simple web application it can be abstracted
in React and at the same time use the ReactTHREEFiber library so the game engine
logic can be encoded in the same way.

## Components

The application is based on the existing NextJs starter project for the LikveKit
tutorial, where a simple backend component is used to generate tokens for the
apps to use.

The main functionality happens at the front-end where the venue screens and
player devices share a web client/server abstraction.

- `Station` Stage the React component that holds the venue screen logic, the idea is
  to make games "pluggeable" so different games can be loaded at different
  `Station`s. This POC has a basic Frogger-like game to demo the idea.
- `Player` Stage a React component holding a basic screen for the user to allow
  for accelerometer and gyro data read for the browser and basic game input ui.
- `game/[userType]/page.tsx` Basic routing for `Station`s and `Player`s and
  stablishes the LiveKit connection.
- `useGameState` Basic state management using `zustand`.
- `Game` A basic React THREE Fiber game logic to demo the idea of a shared game
  space.

## Architecture description

<!-- Mermaid diagram -->
