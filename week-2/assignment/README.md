# Week 2 — JavaScript Runtime and Async

A small task runner (Load Users / Load Posts / Load Comments) built with plain HTML, CSS and vanilla JavaScript.
Open `index.html` in a browser; everything on the page is computed live by `script.js`.

Files:

- `index.html` — page structure and the explanation blocks
- `style.css` — styling
- `script.js` — `createTask`, Run All, sequential vs concurrent comparison, event loop demo

---

## 1. How the closure keeps the task counter private

```js
function createTask(name) {
  let count = 0;            // lives only inside this call of createTask
  function run() { count += 1; /* … */ }
  function getCount() { return count; }
  function reset() { count = 0; }
  return { name, run, getCount, reset };
}

const users = createTask("Load Users");
const posts = createTask("Load Posts");
```

`count` is a local variable of `createTask`. Normally it would disappear when the function returns, but
`run`, `getCount` and `reset` were created inside that scope and still reference it, so JavaScript keeps it alive.
That bundle of "function + the scope it was created in" is a closure.

The returned object has no `count` property (`users.count` is `undefined`), so the only way to touch the
counter is through the three functions. Every call to `createTask` executes the function body again and creates a
**fresh** `count`, which is why `users.getCount()` and `posts.getCount()` are independent: clicking **Run** on one
card never changes the other card's number.

## 2. How the call stack works in one example

Clicking **Run All Tasks** calls `runAll()`. This is what the call stack looks like while the synchronous part runs:

```
runAll()
  └─ tasks.map(cb)
       └─ cb(task)
            └─ task.run()
                 └─ new Promise(executor)
                      └─ executor(resolve, reject)
                           └─ setTimeout(callback, delay)   ← registers the timer and returns
```

Every function call pushes a frame on top; when the function returns, its frame is popped.
`setTimeout` only *registers* the callback with the browser and returns immediately, so `executor`,
`new Promise`, `task.run`, `cb` pop one after another. `map` calls `cb` again for the next task, and the same
stack grows and shrinks two more times. Finally `runAll` reaches `await Promise.allSettled(...)`, suspends, and
its frame is popped too. The stack is now empty — nothing is "waiting" on it.

When a timer fires 500–2000 ms later, the browser puts its callback into the task queue. The event loop sees the
empty stack, pushes the callback, it calls `resolve()` or `reject()`, and it is popped again.

## 3. How JavaScript can continue while `setTimeout` is waiting

JavaScript has one thread and one call stack, but *waiting* is not done by JavaScript. `setTimeout(cb, 1500)`
hands the timer to the browser (a Web API that runs outside the JavaScript engine) and returns right away.
The engine goes on executing the next line — for example starting the second and third task. While the browser
counts down, the stack is free, so the UI stays responsive and the status badges keep animating.

When the timer expires, the browser does **not** interrupt running code. It just places the callback in the task
queue. The event loop takes it only when the call stack is empty. That is also why `setTimeout(cb, 0)` is never
"immediately": it means "after everything currently on the stack and every pending microtask".

## 4. Predicted and actual Event Loop output

Demo code (button **Run Event Loop Demo**):

```js
function eventLoopDemo(log) {
  log("1. script start");

  setTimeout(() => {
    log("7. timeout A");
    Promise.resolve().then(() => log("8. microtask inside timeout A"));
  }, 0);

  setTimeout(() => log("9. timeout B"), 0);

  Promise.resolve().then(() => log("4. promise 1"));
  Promise.resolve().then(() => log("5. promise 2"));

  async function asyncFn() {
    log("2. async start");
    await null;
    log("6. async after await");
  }
  asyncFn();

  log("3. script end");
}
```

Predicted output (written before running):

```
1. script start
2. async start
3. script end
4. promise 1
5. promise 2
6. async after await
7. timeout A
8. microtask inside timeout A
9. timeout B
```

Actual output (Chrome, also visible in DevTools console): identical, all nine lines in the same order.
The page compares both lists line by line and marks each line with ✓.

Explanation, step by step:

1. **Call Stack.** `eventLoopDemo` runs top to bottom. `"1. script start"` is printed. Both `setTimeout` calls
   register their timers and return. Both `.then()` callbacks are placed in the microtask queue. `asyncFn()` runs
   synchronously until its first `await`, so `"2. async start"` is printed immediately; the rest of the function is
   scheduled as a microtask. `"3. script end"` is printed. The function returns and the stack is empty.
2. **Microtask Queue.** Before any timer is considered, the whole microtask queue is drained in registration
   order: `"4. promise 1"`, `"5. promise 2"`, then the continuation of `asyncFn` → `"6. async after await"`.
   The async continuation was queued last, so it prints last, even though its code appears "earlier" than the
   `.then()` calls in a reading sense.
3. **Task Queue.** Now the event loop takes the first expired timer: `"7. timeout A"`. Inside it a new microtask
   is queued.
4. **Microtasks again.** After *every* task the microtask queue is drained before the next task is taken, so
   `"8. microtask inside timeout A"` prints before timeout B.
5. **Next task.** `"9. timeout B"` prints.

Order of priority: **Call Stack → Microtask Queue → Task Queue**, repeated forever by the **Event Loop**.

## 5. Tasks vs microtasks

| | Tasks (macrotasks) | Microtasks |
|---|---|---|
| Created by | `setTimeout`, `setInterval`, DOM events, I/O | `Promise.then/catch/finally`, `await`, `queueMicrotask`, `MutationObserver` |
| When they run | One per loop iteration, after the microtask queue is empty | All of them, right after the current stack empties and after each task |
| Can starve rendering? | No — the browser may render between tasks | Yes — an endless chain of microtasks blocks rendering |

The key rule: the microtask queue is drained **completely** before the event loop moves to the next task.
That is why every promise callback in the demo ran before the first 0 ms timer, and why the microtask queued
inside timeout A ran before timeout B.

## 6. How multiple Promises and errors are handled

- Each `task.run()` returns a `Promise`. Inside the executor the timer callback calls `resolve(...)` on success or
  `reject(new Error(...))` on the random failure (about 30 % of runs).
- **Single run** (card button): `task.run().catch(err => console.warn(err.message))` — the rejection is consumed so
  there is no "Uncaught (in promise)" error; the card shows the status through the closure's subscriber.
- **Run All**: `Promise.allSettled(tasks.map(t => t.run()))`. `allSettled` never rejects; it waits for every
  promise to be fulfilled *or* rejected and returns `{ status, value | reason }` per task. The page then prints
  `Load Users — Completed`, `Load Posts — Failed`, … and shows "All tasks finished" only after the last one settles.
  `Promise.all` was deliberately not used: it rejects on the first failure and we would lose the other results.
- **Sequential run**: each `await task.run()` is wrapped in `try/catch`, so a failed task is recorded and the loop
  continues with the next one instead of aborting the chain.

## 7. Sequential vs concurrent execution

```js
// sequential — total ≈ d1 + d2 + d3
await task1.run();
await task2.run();
await task3.run();

// concurrent — total ≈ max(d1, d2, d3)
await Promise.allSettled([task1.run(), task2.run(), task3.run()]);
```

Sample measurement from the page (values are random on every run):

| Task | Sequential | Concurrent |
|---|---|---|
| Load Users | 1 431 ms | 812 ms |
| Load Posts | 623 ms | 1 907 ms |
| Load Comments | 1 788 ms | 1 265 ms |
| **Total** | **3 846 ms** (≈ sum) | **1 911 ms** (≈ max) |

In the sequential version `await` pauses `runSequential` until the first timer fires; only then is the second
`run()` called and its timer started. The timers never overlap, so the total is the sum of the delays.
In the concurrent version the three `run()` calls happen synchronously one after another, so three timers count
down in the browser at the same time, and `allSettled` waits once, for the slowest one. JavaScript is
single-threaded, but the waiting happens outside JavaScript, so any number of timers can wait in parallel.
Use sequential execution only when a step really depends on the result of the previous one.
