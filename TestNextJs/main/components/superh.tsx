'use client';
import { Component } from "react";

export default class SuperH extends Component<{
    children?: React.ReactNode,
    text: string
}> {

    render() {
        return (
          <h1>{this.props.text}</h1>
        );
      }
}