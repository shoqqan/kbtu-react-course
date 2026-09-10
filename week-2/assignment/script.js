/* =========================================================================
   Week 2 — JavaScript Runtime and Async
   Closures · Call Stack · Promises · async/await · Event Loop · Tasks vs Microtasks
   Everything on the page is driven by this file; open the console to see
   the same logs.
   ========================================================================= */

/* ------------------------------------------------------------------ */
/* 1 — createTask: a closure with a PRIVATE counter                    */
/* ------------------------------------------------------------------ */
function createTask(name) {
  // These variables live in the scope of THIS createTask call.
  // Nobody outside can read or write them — only the functions below,
  // which "close over" them, can. That is the closure.
  let count = 0; // how many times run() was called
  let status = "idle"; // idle | running | completed | failed
  let lastDuration = null; // ms of the last run
  const listeners = new Set(); // UI subscribers

  function getState() {
    return { name, status, count, lastDuration };
  }
  function notify() {
    listeners.forEach((fn) => fn(getState()));
  }

  function run() {
    count += 1;
    status = "running";
    lastDuration = null;
    const started = performance.now();
    notify();
    console.log(`[${name}] run #${count} started`);

    return new Promise((resolve, reject) => {
      const delay = Math.round(500 + Math.random() * 1500); // 500–2000 ms
      // setTimeout hands the timer to the browser and returns immediately.
      // The callback is pushed to the TASK queue when the timer fires.
      setTimeout(() => {
        lastDuration = Math.round(performance.now() - started);
        if (Math.random() < 0.3) {
          status = "failed";
          notify();
          console.log(`[${name}] failed after ${lastDuration} ms`);
          reject(new Error(`${name} failed`));
        } else {
          status = "completed";
          notify();
          console.log(`[${name}] completed after ${lastDuration} ms`);
          resolve(`${name} loaded`);
        }
      }, delay);
    });
  }

  function getCount() {
    return count;
  }

  function reset() {
    count = 0;
    status = "idle";
    lastDuration = null;
    notify();
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(getState());
  }

  // Only these functions are exposed. `count` itself never leaves this scope.
  return { name, run, getCount, reset, getState, subscribe };
}

const tasks = [createTask("Load Users"), createTask("Load Posts"), createTask("Load Comments")];

// Proof that the counter is private: there is no `count` property on the object.
console.log("tasks[0].count →", tasks[0].count, "| tasks[0].getCount() →", tasks[0].getCount());

/* ------------------------------------------------------------------ */
/* Small DOM helpers                                                   */
/* ------------------------------------------------------------------ */
const $ = (id) => document.getElementById(id);
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
const formatMs = (ms) => (ms == null ? "—" : `${Math.round(ms)} ms`);
const STATUS_LABEL = { idle: "Idle", running: "Running…", completed: "Completed", failed: "Failed" };

/* ------------------------------------------------------------------ */
/* 2 — Task cards                                                      */
/* ------------------------------------------------------------------ */
function renderTaskCards() {
  const container = $("task-cards");
  tasks.forEach((task) => {
    const card = el("article", "card task-card");
    const title = el("h3", null, task.name);
    const badge = el("span", "status status--idle", "Idle");
    const meta = el("dl", "meta");
    const countValue = el("dd", null, "0");
    const timeValue = el("dd", null, "—");
    meta.append(el("dt", null, "Executions"), countValue, el("dt", null, "Loading time"), timeValue);

    const actions = el("div", "actions");
    const runBtn = el("button", "btn btn--primary", "Run");
    const resetBtn = el("button", "btn", "Reset");
    actions.append(runBtn, resetBtn);

    runBtn.addEventListener("click", () => {
      // The rejection is handled here so a failed single run does not
      // become an "Uncaught (in promise)" error.
      task.run().catch((err) => console.warn(err.message));
    });
    resetBtn.addEventListener("click", () => task.reset());

    task.subscribe(({ status, count, lastDuration }) => {
      badge.textContent = STATUS_LABEL[status];
      badge.className = `status status--${status}`;
      countValue.textContent = String(count);
      timeValue.textContent = formatMs(lastDuration);
      runBtn.disabled = status === "running";
    });

    card.append(title, badge, meta, actions);
    container.appendChild(card);
  });
}

/* ------------------------------------------------------------------ */
/* 3 — Run All Tasks (concurrently) with Promise.allSettled            */
/* ------------------------------------------------------------------ */
function describeResults(results) {
  return results.map((r, i) => ({
    name: tasks[i].name,
    ok: r.status === "fulfilled",
    text: r.status === "fulfilled" ? r.value : r.reason.message,
  }));
}

function renderResultList(target, results) {
  target.innerHTML = "";
  describeResults(results).forEach(({ name, ok }) => {
    const li = el("li", ok ? "result result--ok" : "result result--fail");
    li.innerHTML = `<span>${name}</span><b>${ok ? "Completed" : "Failed"}</b>`;
    target.appendChild(li);
  });
}

async function runAll() {
  const btn = $("run-all");
  const message = $("run-all-message");
  btn.disabled = true;
  message.textContent = "Running all tasks…";
  message.className = "message message--pending";
  $("run-all-results").innerHTML = "";

  const t0 = performance.now();
  // tasks.map(...) starts ALL three timers right now, one after another,
  // without waiting. allSettled resolves when every promise is fulfilled
  // OR rejected — so "All tasks finished" appears only after the last one.
  const results = await Promise.allSettled(tasks.map((task) => task.run()));
  const total = performance.now() - t0;

  renderResultList($("run-all-results"), results);
  const failed = results.filter((r) => r.status === "rejected").length;
  message.textContent = `All tasks finished in ${formatMs(total)} (${results.length - failed} completed, ${failed} failed)`;
  message.className = "message message--done";
  console.log("All tasks finished", describeResults(results));
  btn.disabled = false;
}

/* ------------------------------------------------------------------ */
/* 4 — Sequential vs Concurrent                                        */
/* ------------------------------------------------------------------ */
async function runSequential() {
  const t0 = performance.now();
  const durations = [];
  for (const task of tasks) {
    // `await` pauses ONLY this async function until the promise settles.
    // The next task is not even started until the previous one is done.
    try {
      await task.run();
    } catch (err) {
      // A failed task still took time; we record it and continue,
      // otherwise one failure would abort the whole chain.
      console.warn("sequential:", err.message);
    }
    durations.push(task.getState().lastDuration);
  }
  return { total: performance.now() - t0, durations };
}

async function runConcurrent() {
  const t0 = performance.now();
  // All three run() calls happen synchronously in a row → three timers
  // tick at the same time inside the browser. We wait once, for all of them.
  await Promise.allSettled(tasks.map((task) => task.run()));
  const durations = tasks.map((task) => task.getState().lastDuration);
  return { total: performance.now() - t0, durations };
}

async function compare() {
  const btn = $("compare");
  const status = $("compare-status");
  const table = $("compare-table");
  const explanation = $("compare-explanation");
  btn.disabled = true;
  table.hidden = true;
  explanation.hidden = true;

  status.textContent = "Step 1/2 — running sequentially (await one by one)…";
  const seq = await runSequential();
  status.textContent = "Step 2/2 — running concurrently (Promise.allSettled)…";
  const con = await runConcurrent();
  status.textContent = "Done. Compare the totals below.";

  const cell = (v) => `<td>${formatMs(v)}</td>`;
  table.querySelector("tbody").innerHTML = `
    ${tasks
      .map(
        (t, i) => `<tr><td>${t.name}</td>${cell(seq.durations[i])}${cell(con.durations[i])}</tr>`
      )
      .join("")}
    <tr class="total"><td>Total</td>${cell(seq.total)}${cell(con.total)}</tr>
    <tr class="hint"><td>≈ formula</td><td>sum = ${formatMs(seq.durations.reduce((a, b) => a + b, 0))}</td><td>max = ${formatMs(Math.max(...con.durations))}</td></tr>
  `;
  table.hidden = false;

  const ratio = (seq.total / con.total).toFixed(1);
  explanation.innerHTML = `
    <p><b>Sequential took ${formatMs(seq.total)}, concurrent took ${formatMs(con.total)} — about ${ratio}× faster.</b></p>
    <p>Sequential: <code>await task1.run()</code> pauses the function until the first timer fires,
    only then <code>task2.run()</code> starts its own timer, and so on. The timers never overlap,
    so the total is the <b>sum</b> of the three delays.</p>
    <p>Concurrent: <code>tasks.map(t => t.run())</code> calls all three <code>run()</code> synchronously,
    so three timers are ticking in the browser at the same moment. <code>Promise.allSettled</code>
    waits once, for the slowest of them, so the total is the <b>max</b> of the three delays.</p>
    <p>JavaScript itself is single-threaded, but waiting is not done by JavaScript: timers run in the
    browser, outside the call stack, so many of them can wait in parallel.</p>
  `;
  explanation.hidden = false;
  console.log("sequential:", seq, "concurrent:", con);
  btn.disabled = false;
}

/* ------------------------------------------------------------------ */
/* 5 — Event Loop demo                                                 */
/* ------------------------------------------------------------------ */
const PREDICTED_OUTPUT = [
  "1. script start",
  "2. async start",
  "3. script end",
  "4. promise 1",
  "5. promise 2",
  "6. async after await",
  "7. timeout A",
  "8. microtask inside timeout A",
  "9. timeout B",
];

const PREDICTED_KIND = {
  "1. script start": "sync",
  "2. async start": "sync",
  "3. script end": "sync",
  "4. promise 1": "micro",
  "5. promise 2": "micro",
  "6. async after await": "micro",
  "7. timeout A": "task",
  "8. microtask inside timeout A": "micro",
  "9. timeout B": "task",
};

function eventLoopDemo(log) {
  log("1. script start"); // synchronous — runs on the call stack immediately

  setTimeout(() => {
    log("7. timeout A"); // TASK — waits for the stack AND the microtask queue to be empty
    Promise.resolve().then(() => log("8. microtask inside timeout A")); // microtask queued during a task
  }, 0);

  setTimeout(() => log("9. timeout B"), 0); // TASK — second timer, goes after timeout A

  Promise.resolve().then(() => log("4. promise 1")); // MICROTASK
  Promise.resolve().then(() => log("5. promise 2")); // MICROTASK

  async function asyncFn() {
    log("2. async start"); // synchronous — an async function runs until its first await
    await null; // everything after await becomes a MICROTASK
    log("6. async after await");
  }
  asyncFn();

  log("3. script end"); // synchronous — last line of the script
}

function renderPrediction() {
  const ul = $("predicted");
  PREDICTED_OUTPUT.forEach((line) => {
    const li = el("li", `line kind-${PREDICTED_KIND[line]}`);
    li.innerHTML = `<span>${line}</span><small>${PREDICTED_KIND[line]}</small>`;
    ul.appendChild(li);
  });
}

function runEventLoopDemo() {
  const btn = $("run-demo");
  const ul = $("actual");
  const verdict = $("demo-verdict");
  const explanation = $("demo-explanation");
  ul.innerHTML = "";
  verdict.textContent = "";
  explanation.hidden = true;
  btn.disabled = true;

  const actual = [];
  const log = (line) => {
    console.log(line);
    actual.push(line);
    const index = actual.length - 1;
    const matches = PREDICTED_OUTPUT[index] === line;
    const li = el("li", `line kind-${PREDICTED_KIND[line] ?? "sync"} ${matches ? "match" : "mismatch"}`);
    li.innerHTML = `<span>${line}</span><small>${matches ? "✓" : "✗ expected: " + PREDICTED_OUTPUT[index]}</small>`;
    ul.appendChild(li);
  };

  console.group("Event Loop demo");
  eventLoopDemo(log);
  // At this exact moment only the 3 synchronous lines exist.
  // Microtasks and timers have not run yet — we are still on the call stack.
  console.log("(synchronous part finished — stack is about to become empty)");

  // A third timer, registered LAST, therefore fires after timeout B.
  // We use it only to know when the demo is over.
  setTimeout(() => {
    console.groupEnd();
    const same = actual.length === PREDICTED_OUTPUT.length && actual.every((l, i) => l === PREDICTED_OUTPUT[i]);
    verdict.textContent = same
      ? "Actual output matches the prediction exactly."
      : "Actual output differs from the prediction — see the marked lines.";
    verdict.className = same ? "message message--done" : "message message--fail";
    explanation.hidden = false;
    btn.disabled = false;
  }, 0);
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderTaskCards();
  renderPrediction();
  $("run-all").addEventListener("click", runAll);
  $("reset-all").addEventListener("click", () => {
    tasks.forEach((task) => task.reset());
    $("run-all-results").innerHTML = "";
    $("run-all-message").textContent = "";
  });
  $("compare").addEventListener("click", compare);
  $("run-demo").addEventListener("click", runEventLoopDemo);
});
