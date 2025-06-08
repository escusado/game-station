## Drop In-N'-Out Shared Games

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

The application is built with Next.js and uses LiveKit for real-time communication
between player devices and station displays. It implements a "Frogger-style" game
where players control frog characters using their mobile device sensors.

### Core Architecture

The application follows a client-server architecture using LiveKit for real-time
communication between player devices and station displays:

**Frontend Entry Points:**

- `game/[userType]/page.tsx` - Main entry point that handles routing between
  player and station modes, manages LiveKit room connections, and token
  authentication

**Player Side (Mobile Devices):**

- `PlayerStage.tsx` - React component for mobile devices that captures
  accelerometer and gyroscope data from device sensors and transmits input data
  to the station via LiveKit text streams at 50ms intervals
- `PlayerMain.tsx` - UI component that renders the mobile interface with sensor
  debug information and a jump button
- `ChunkyButton.tsx` - Touch-optimized button component with haptic feedback
  support for mobile controls

**Station Side (Venue Displays):**

- `StationStage.tsx` - React component for venue displays that receives player
  input data, manages participant connections using a Zustand store, and renders
  the game interface with QR code for joining
- `usePlayersStore` - Zustand store singleton for centralized state management
  of connected players and their real-time input data
- `JoinQrCode.tsx` - QR code component that displays the join URL for players

**Game Engine (Three.js/React Three Fiber):**

- `Game.tsx` - Main React Three Fiber Canvas component that sets up the 3D
  scene with camera, lighting, and physics
- `Level.tsx` - 3D scene manager that positions players and renders terrain,
  roads, and game objects using Rapier physics
- `FrogPlayer.tsx` - Individual 3D player representation using animated frog
  models with direction indicators, controlled by device gyroscope data
- `Terrain.tsx` - Static 3D ground plane that serves as the game environment
- `Road.tsx` - Road segment component with traffic and road tiles
- `RoadTile.tsx` - Individual road segment using 3D models
- `Traffic.tsx` - Animated vehicle system with multiple car models that spawn
  and move across roads
- `CarModel.tsx` - Wrapper for vehicle 3D models

**3D Assets & Models:**

- `models_build/` - Auto-generated React components from GLTF models including
  frogs, cars, boats, direction markers, gates, and road elements
- All models are optimized and transformed for web delivery

**Backend Services:**

- `api/token/route.ts` - Next.js API endpoint that generates LiveKit access
  tokens for secure room authentication using environment variables

### Technology Stack

**Core Framework:**

- Next.js 15.3.3 with TypeScript
- React 19 with React Three Fiber for 3D rendering
- Three.js for 3D graphics and WebGL

**Real-time Communication:**

- LiveKit for WebRTC-based real-time communication
- Text streams for sensor data transmission (50ms intervals)

**3D Graphics & Physics:**

- @react-three/fiber - React renderer for Three.js
- @react-three/drei - Useful helpers and components for R3F
- @react-three/rapier - Physics engine integration
- Three.js for 3D scene management

**State Management:**

- Zustand for global player state management
- React hooks for local component state

**Mobile Device Integration:**

- Device Motion API for accelerometer data
- Device Orientation API for gyroscope data
- iOS 13+ permission handling for sensor access
- Touch events with haptic feedback support
- QR code generation for easy mobile joining

### Component Overview

### Architecture Interaction Diagram

```
                    ┌────────────────────────────────┐
                    │         Entry Point            │
                    │   game/[userType]/page.tsx     │
                    │  • Route handling (player/station)
                    │  • LiveKit room connection     │
                    │  • Token authentication        │
                    └──────────┬─────────────────────┘
                    ┌──────────▼─────────────┐
                    │     Token API  BACKEND │
                    │   api/token/route.ts   │
                    │  • JWT token generation│
                    │  • Environment config  │
                    └──────────┬─────────────┘
                               │
                    ┌──────────▼─────────────┐
                    │    LiveKit Room        │
                    │  • WebRTC connection   │
                    │  • Text stream comm.   │
                    └──┬─────────────────┬───┘
                       │                 │
        ┌──────────────▼─────┐           │
        │   Mobile Device    │           │
        │     (Player)       │           │
        │ ┌────────────────┐ │           │
        │ │ Device Sensors │ │           │
        │ │ • Accelerometer│ │           │
        │ │ • Gyroscope    │ │           │
        │ │ • Touch Events │ │           │
        │ └────────┬───────┘ │           │
        │ ┌────────▼───────┐ │           │
        │ │  PlayerStage   │ │           │
        │ │ • Data capture │ │           │
        │ │ • 50ms streams │ │           │
        │ │ • UI controls  │ │           │
        │ └┬───────────────┘ │           │
        └─-|───────-─────────┘           │
           |                             │
           |                 ┌──────────-▼─────────────┐
           |                 │   Venue Display         │
           |                 │     (Station)           │
           |                 │ ┌─────────────────────┐ │
           |                 │ │   StationStage      │ │
           |                 │ │ • Player management │ │
           |                 │ │ • Data processing   │ │
           |                 │ │ • QR code display   │ │
           |                 │ └──────────┬──────────┘ │
           |                 │ ┌──────────▼──────────┐ │
           |                 │ │    Game (R3F)       │◄┼─---┐
           |                 │ │ • 3D Canvas setup   │ │    │
           |                 │ │ • Camera & lighting │ │    │
           |                 │ │ • Scene             │ │    │
           |                 │ └──────────┬──────────┘ │    │
           |                 │ ┌──────────▼──────────┐ │    │
           |                 │ │       Level         │ │    │
           |                 │ │ • Physics (Rapier)  │ │    │
           |                 │ │ • Scene management  │ │    │
           |                 │ └──┬─────────────┬────┘ │    │
           |                 │ ┌──▼───────┐ ┌──▼────┐  │    │
           |                 │ │FrogPlayer│ │Terrain│  │    │
           |                 │ │• 3D Frogs│ │• Roads│  │    │
           |                 │ │• Movement│ │• Tiles│  │    │
           |                 │ │• Models  │ │Traffic│  │    │
           |                 │ └──────────┘ └───────┘  │    │
           |                 └─────────────────────────┘    │
           |                 ┌───────────────────────────---┘
           |                 │
           |       ┌─────────▼────────────┐
           |       │   State Management   │
           |       │                      │
           |       │ ┌──────────────────┐ │
           |       │ │ usePlayersStore  │ │
           |       │ │   (Zustand)      │ │
           |       │ │                  │ │
           |       │ │ • Players[]      │ │
           |       │ │ • Input data     │ │
           |       │ │ • Real-time sync │ │
           └----------🞂 Sensor data    │ │
                   │ └──────────────────┘ │
                   └──────────────────────┘

```
