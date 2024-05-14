# FeatBit React client SDK example with Next.js

This project is an example of how to use the [featbit-react-client-sdk](https://github.com/featbit/featbit-react-client-sdk) with Next.Js.
It is built based on the project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses the **Pages**, for example using **App Router**, please refer to the [Next.js App Router example](../nextjs-app).

This example used `withFfcProvider` function to initialize the SDK.

> Important
> In your project, you would need to add `@featbit/react-client-sdk` to the `transpileModules` list in the [next.config.mjs](next.config.mjs) file.

# Rune the example

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

![Demo](./public/demo.gif)

# Explications
- next.config.mjs: add `@featbit/react-client-sdk` to the `transpileModules` list
- FeatBitProvider.tsx: create a wrapper component to provide the context to descendant components, it is used in the `layout.tsx` file
- test-component.tsx: a client component that consumes the fbClient and flags