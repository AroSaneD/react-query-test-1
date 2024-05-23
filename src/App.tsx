import { useEffect, useRef, useState, Suspense } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";

const client = new QueryClient();

function MutationTest() {
  const countRef = useRef<number>(0);
  const { data, mutateAsync } = useMutation(
    ["key"],
    () => {
      console.log("Calling async function 2");
      return new Promise<number>((res) => {
        setTimeout(() => {
          console.log("Calling async function");
          res(countRef.current++);
        }, 1000);
      });
    },
    {}
  );

  return <button onClick={() => mutateAsync()}>count is {data}</button>;
}

class DemoClient {
  constructor(private token: string) {}

  demoMethod() {
    console.log("Calling using token: ", this.token);
    return this.token;
  }
}

function MemoizationTest() {
  const renderCount = useRef(0);
  const [trigger, callTrigger] = useState(0);
  const [queryTrigger, callQueryTrigger] = useState(0);
  const client = new DemoClient(`Access token nr: ${renderCount.current}`);
  useEffect(() => {
    renderCount.current++;
  });
  const testResult = useQuery(
    ["some-key", queryTrigger],
    () => {
      return Promise.resolve(client.demoMethod());
    },
    {
      staleTime: 10 * 1000,
      cacheTime: 10 * 1000,
      suspense: true,
    }
  ).data;

  return (
    <>
      Currently rendered {renderCount.current} frames
      <br />
      Use query result:{testResult}
      <br />
      <button onClick={() => callTrigger((o) => o + 1)}>Rerender</button>
      &nbsp;
      <button onClick={() => callQueryTrigger((o) => o + 1)}>
        Force query trigger
      </button>
    </>
  );
}

function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <Suspense fallback={"Loading..."}>
          <div>
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <MemoizationTest />
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </div>
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default App;
