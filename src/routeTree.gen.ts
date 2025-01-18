/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ChallengeIndexImport } from './routes/challenge/index'
import { Route as ChallengeErrorImport } from './routes/challenge/error'
import { Route as ChallengePolicyIdImport } from './routes/challenge/$policyId'

// Create Virtual Routes

const SandboxLazyImport = createFileRoute('/sandbox')()
const FinishLazyImport = createFileRoute('/finish')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SandboxLazyRoute = SandboxLazyImport.update({
  id: '/sandbox',
  path: '/sandbox',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/sandbox.lazy').then((d) => d.Route))

const FinishLazyRoute = FinishLazyImport.update({
  id: '/finish',
  path: '/finish',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/finish.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ChallengeIndexRoute = ChallengeIndexImport.update({
  id: '/challenge/',
  path: '/challenge/',
  getParentRoute: () => rootRoute,
} as any)

const ChallengeErrorRoute = ChallengeErrorImport.update({
  id: '/challenge/error',
  path: '/challenge/error',
  getParentRoute: () => rootRoute,
} as any)

const ChallengePolicyIdRoute = ChallengePolicyIdImport.update({
  id: '/challenge/$policyId',
  path: '/challenge/$policyId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/finish': {
      id: '/finish'
      path: '/finish'
      fullPath: '/finish'
      preLoaderRoute: typeof FinishLazyImport
      parentRoute: typeof rootRoute
    }
    '/sandbox': {
      id: '/sandbox'
      path: '/sandbox'
      fullPath: '/sandbox'
      preLoaderRoute: typeof SandboxLazyImport
      parentRoute: typeof rootRoute
    }
    '/challenge/$policyId': {
      id: '/challenge/$policyId'
      path: '/challenge/$policyId'
      fullPath: '/challenge/$policyId'
      preLoaderRoute: typeof ChallengePolicyIdImport
      parentRoute: typeof rootRoute
    }
    '/challenge/error': {
      id: '/challenge/error'
      path: '/challenge/error'
      fullPath: '/challenge/error'
      preLoaderRoute: typeof ChallengeErrorImport
      parentRoute: typeof rootRoute
    }
    '/challenge/': {
      id: '/challenge/'
      path: '/challenge'
      fullPath: '/challenge'
      preLoaderRoute: typeof ChallengeIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/finish': typeof FinishLazyRoute
  '/sandbox': typeof SandboxLazyRoute
  '/challenge/$policyId': typeof ChallengePolicyIdRoute
  '/challenge/error': typeof ChallengeErrorRoute
  '/challenge': typeof ChallengeIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/finish': typeof FinishLazyRoute
  '/sandbox': typeof SandboxLazyRoute
  '/challenge/$policyId': typeof ChallengePolicyIdRoute
  '/challenge/error': typeof ChallengeErrorRoute
  '/challenge': typeof ChallengeIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/finish': typeof FinishLazyRoute
  '/sandbox': typeof SandboxLazyRoute
  '/challenge/$policyId': typeof ChallengePolicyIdRoute
  '/challenge/error': typeof ChallengeErrorRoute
  '/challenge/': typeof ChallengeIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/finish'
    | '/sandbox'
    | '/challenge/$policyId'
    | '/challenge/error'
    | '/challenge'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/finish'
    | '/sandbox'
    | '/challenge/$policyId'
    | '/challenge/error'
    | '/challenge'
  id:
    | '__root__'
    | '/'
    | '/finish'
    | '/sandbox'
    | '/challenge/$policyId'
    | '/challenge/error'
    | '/challenge/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  FinishLazyRoute: typeof FinishLazyRoute
  SandboxLazyRoute: typeof SandboxLazyRoute
  ChallengePolicyIdRoute: typeof ChallengePolicyIdRoute
  ChallengeErrorRoute: typeof ChallengeErrorRoute
  ChallengeIndexRoute: typeof ChallengeIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  FinishLazyRoute: FinishLazyRoute,
  SandboxLazyRoute: SandboxLazyRoute,
  ChallengePolicyIdRoute: ChallengePolicyIdRoute,
  ChallengeErrorRoute: ChallengeErrorRoute,
  ChallengeIndexRoute: ChallengeIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/finish",
        "/sandbox",
        "/challenge/$policyId",
        "/challenge/error",
        "/challenge/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/finish": {
      "filePath": "finish.lazy.tsx"
    },
    "/sandbox": {
      "filePath": "sandbox.lazy.tsx"
    },
    "/challenge/$policyId": {
      "filePath": "challenge/$policyId.tsx"
    },
    "/challenge/error": {
      "filePath": "challenge/error.tsx"
    },
    "/challenge/": {
      "filePath": "challenge/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
