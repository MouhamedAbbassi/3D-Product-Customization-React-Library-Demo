# 3D Configurator Component Library

## Overview

This library provides a 3D configurator component for React applications, built using `@react-three/fiber` and `three.js`. The main component, `GLBViewer`, allows you to load and customize GLB models interactively.

## Installation

To use this library in your project, you need to install it along with its peer dependencies.

```sh
npm install 3d-configurator-component-library
npm install react@^19.0.0 react-dom@^19.0.0
```

## Usage

Here is an example of how to use the `GLBViewer` component in your React application:

```jsx
import React from 'react';
import { GLBViewer } from '3d-configurator-component-library';

function App() {
  return (
    <div className="App">
      <GLBViewer glbUrl="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb" />
    </div>
  );
}

export default App;
```

## GLBViewer Component

The `GLBViewer` component allows you to load and customize a GLB model.

### Props

- `glbUrl`: The URL of the GLB model to load.

### Customization

The `GLBViewer` component provides an interface to select and customize parts of the model. You can select different parts and change their materials interactively.

### Development

To run the library locally for development:

```sh
npm install
npm run dev
```

To build the library:

```sh
npm run build
```

To run Storybook:

```sh
npm run storybook
```

To build Storybook:

```sh
npm run build-storybook
```

## License

This project is licensed under the MIT License.
