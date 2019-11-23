import React from "react";
import MyComponent from "./MyComponent";
import { DrizzleContext } from "drizzle-react";

export default () => (
  <DrizzleContext.Consumer>
    {
      drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        if (!initialized) {
          return "Loading...";
        }
        return (<MyComponent drizzle={drizzle} drizzleState={drizzleState} />);
    }}
  </DrizzleContext.Consumer>
);
