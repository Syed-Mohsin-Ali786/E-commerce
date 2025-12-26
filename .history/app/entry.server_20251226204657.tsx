import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      // Correct: Self-closing ServerRouter. Do not put <App /> inside.
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(pipe, {
              status: responseStatusCode,
              headers: responseHeaders,
            })
          );
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
        },
      }
    );
  });
}