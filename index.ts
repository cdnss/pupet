import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import * as puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";import { assertEquals } from "https://deno.land/std@0.198.0/assert/mod.ts";
import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
import * as path from "https://deno.land/std@0.198.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.198.0/media_types/mod.ts";

interface RequestInfo {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
}

interface InterceptedRequest {
  request: RequestInfo;
  respond: (response: Response) => void;
  continue: (overrides?: Partial<RequestInfo>) => void;
  abort: (error: string) => void;
}

interface Response {
  status: number;
  headers: Record<string, string>;
  body: string | null;
}

class RequestInterceptor {
  private interceptedRequests: InterceptedRequest[] = [];

  async intercept(page: Page, url: string) {
    await page.setRequestInterception(true);

    page.on("request", async (interceptedRequest) => {
      const requestInfo: RequestInfo = {
        url: interceptedRequest.url(),
        method: interceptedRequest.method(),
        headers: interceptedRequest.headers(),
        body: interceptedRequest.postData() || null,
      };

      const continueFn = async (overrides?: Partial<RequestInfo>) => {
        if (overrides) {
          await interceptedRequest.continue({
            ...overrides,
            headers: { ...interceptedRequest.headers(), ...overrides.headers },
          });
        } else {
          await interceptedRequest.continue();
        }
      };

      const abortFn = (error: string) => {
        interceptedRequest.abort(error);
      };

      const respondFn = async (response: Response) => {
        await interceptedRequest.respond({
          status: response.status,
          headers: response.headers,
          contentType: response.headers["content-type"] || "text/plain",
          body: response.body || "",
        });
      };

      const intercepted: InterceptedRequest = {
        request: requestInfo,
        respond: respondFn,
        continue: continueFn,
        abort: abortFn,
      };

      this.interceptedRequests.push(intercepted);
    });
  }

  getRequests(): InterceptedRequest[] {
    return this.interceptedRequests;
  }
}

const app = new Application();
const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.response.body = "Hello world!";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

const PORT = 8000;
await app.listen({ port: PORT });

Deno.test("Request Interception Test", async (t) => {
    const browser: Browser = await launch({ headless: true });
    const page: Page = await browser.newPage();
    const requestInterceptor = new RequestInterceptor();

    const server = serve({ port: 8082, onListen: (x) => {
      console.log("test server up")
    } }, (req: Request) => {
      const url = new URL(req.url);
      if(url.pathname == "/data"){
        return new Response(JSON.stringify({message: "Hello from Deno Server"}), {status: 200, headers: { "Content-Type": "application/json" }})
      } else {
        return new Response("Not Found", {status: 404, headers: { "Content-Type": "text/plain"}})
      }

    });
    
    try {

    await requestInterceptor.intercept(page, "http://localhost:8082/data");
    await page.goto("http://localhost:8082/data", { waitUntil: "networkidle0" });

    const requests = requestInterceptor.getRequests();
    
    await t.step("Check if a request was intercepted", () => {
        assertEquals(requests.length, 1);
    });

    await t.step("Check request details", () => {
      const interceptedRequest = requests[0];
      assertEquals(interceptedRequest.request.url, "http://localhost:8082/data");
      assertEquals(interceptedRequest.request.method, "GET");
    });

    await t.step("Check respond method", async () => {
      const interceptedRequest = requests[0];
      const mockResponse: Response = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Mocked Response" }),
      };
      interceptedRequest.respond(mockResponse);
      const response = await page.evaluate(async () => {
        const response = await fetch("http://localhost:8082/data");
        return await response.json();
      });
      assertEquals(response, { message: "Mocked Response" });
    });

      await t.step("Check continue method", async () => {
        const interceptedRequest = requests[0];

        const originalResponse = await page.evaluate(async () => {
          const response = await fetch("http://localhost:8082/data");
          return await response.json();
        });
        
        await page.goto("http://localhost:8082/data", { waitUntil: "networkidle0" });
        interceptedRequest.continue();
        const response = await page.evaluate(async () => {
          const response = await fetch("http://localhost:8082/data");
          return await response.json();
        });
        assertEquals(response, { message: "Hello from Deno Server" });
      });
    } finally {
        browser.close();
        server.close();
    }
});
