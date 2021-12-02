/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type {ActionFunction, LoaderFunction} from 'remix'

type AppLoader<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = (
  args: Omit<Parameters<LoaderFunction>['0'], 'params'> & {params: Params},
) => ReturnType<LoaderFunction>

type AppAction<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = (
  args: Omit<Parameters<ActionFunction>['0'], 'params'> & {params: Params},
) => ReturnType<ActionFunction>
