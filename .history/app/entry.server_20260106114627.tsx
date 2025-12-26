import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { createStaticHandler, createStaticRouter, RouterProvider } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";

import App from "./root";
import routes from "./routes";


export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const handler = createStaticHandler(routes);
  const router = createStaticRouter(handler.dataRoutes, remixContext);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RouterProvider router={router} context={remixContext} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, 5000);
  });
}