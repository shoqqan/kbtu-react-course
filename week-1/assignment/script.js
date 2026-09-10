/* =========================================================================
   Task 0 — JavaScript Refresher
   Each task is a function that receives `log(label, value)`.
   `log` prints to the console AND collects rows for the page.
   The page also shows the source of every task via Function.prototype.toString.
   ========================================================================= */

const tasks = [];
function task(title, notes, run) {
  tasks.push({ title, notes, run });
}

/* Task 8 needs a real global-scope variable, so it lives at the top level. */
const message = "global";

/* ------------------------------------------------------------------ */
/* 1 — Variables and Data Types                                        */
/* ------------------------------------------------------------------ */
task(
  "1 — Variables and Data Types",
  [
    "<b>let vs const:</b> both are block-scoped. <code>let</code> can be reassigned, <code>const</code> cannot. Note: <code>const</code> freezes the binding, not the value — you can still push into a const array or mutate a const object.",
    "<b>typeof null</b> returns <code>\"object\"</code>. This is a historical bug from the first JavaScript implementation that was never fixed to keep old code working.",
    "<b>Primitive types (7):</b> string, number, bigint, boolean, undefined, symbol, null. Everything else (objects, arrays, functions, dates…) is a reference type.",
    "Insight: <code>typeof</code> of an array is <code>\"object\"</code>, so use <code>Array.isArray()</code> to detect arrays.",
  ],
  (log) => {
    const name = "Shoqan";
    let age = 21;
    let isActive = true;
    const courses = ["Web Development", "React", "Algorithms"];
    const address = { city: "Almaty", street: "Baiganin st. 27" };

    log("name", name, typeof name);
    log("age", age, typeof age);
    log("isActive", isActive, typeof isActive);
    log("courses", courses, typeof courses + " (Array.isArray → " + Array.isArray(courses) + ")");
    log("address", address, typeof address);

    let nothing = null;
    let notDefined; // declared but never assigned
    log("nothing (null)", nothing, typeof nothing);
    log("notDefined (undefined)", notDefined, typeof notDefined);

    const primitives = { name, age, isActive, nothing, notDefined };
    const references = { courses, address };
    log("primitive values", Object.keys(primitives));
    log("reference values", Object.keys(references));

    const sentence = `${name} is ${age} years old, lives in ${address.city} and takes ${courses.length} courses: ${courses.join(", ")}.`;
    log("template literal", sentence);
  }
);

/* ------------------------------------------------------------------ */
/* 2 — Arrays                                                          */
/* ------------------------------------------------------------------ */
task(
  "2 — Arrays",
  [
    "<code>map</code>, <code>filter</code>, <code>find</code>, <code>reduce</code> and <code>includes</code> never mutate the array they are called on — they return a new value. The last row proves the original stayed the same.",
    "Insight: <code>reduce</code> should get an initial value (<code>0</code> here). Without it the first element becomes the accumulator, which is a classic source of bugs when the accumulator is a different kind of value than the elements.",
  ],
  (log) => {
    const numbers = [3, 7, 2, 10, 5];

    const doubled = numbers.map((n) => n * 2);
    const greaterThanFive = numbers.filter((n) => n > 5);
    const firstGreaterThanFive = numbers.find((n) => n > 5);
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const hasTen = numbers.includes(10);

    log("original", numbers);
    log("map → ×2", doubled);
    log("filter → > 5", greaterThanFive);
    log("find → first > 5", firstGreaterThanFive);
    log("reduce → sum", sum);
    log("includes(10)", hasTen);
    log("original after all operations", numbers);
  }
);

/* ------------------------------------------------------------------ */
/* 3 — Arrays of Objects                                               */
/* ------------------------------------------------------------------ */
task(
  "3 — Arrays of Objects",
  [
    "To add the <code>passed</code> field without touching the originals, <code>map</code> returns a <b>new object</b> for every student using spread: <code>{ ...student, passed }</code>.",
    "The highest grade is found with <code>reduce</code> that keeps the best student seen so far.",
    "Insight: if I wrote <code>student.passed = ...</code> inside <code>map</code>, the originals would be mutated, because map gives me the same object references, not copies.",
  ],
  (log) => {
    const students = [
      { id: 1, name: "Anna", grade: 85 },
      { id: 2, name: "John", grade: 62 },
      { id: 3, name: "Sara", grade: 91 },
      { id: 4, name: "Mike", grade: 55 },
    ];

    const goodStudents = students.filter((s) => s.grade >= 70);
    const names = students.map((s) => s.name);
    const studentThree = students.find((s) => s.id === 3);
    const best = students.reduce((top, s) => (s.grade > top.grade ? s : top));
    const average = students.reduce((acc, s) => acc + s.grade, 0) / students.length;
    const withPassed = students.map((s) => ({ ...s, passed: s.grade >= 70 }));

    log("grade ≥ 70", goodStudents);
    log("names", names);
    log("id = 3", studentThree);
    log("highest grade", best);
    log("average grade", average);
    log("with passed flag", withPassed);
    log("originals unchanged", students);
  }
);

/* ------------------------------------------------------------------ */
/* 4 — Objects                                                         */
/* ------------------------------------------------------------------ */
task(
  "4 — Objects",
  [
    "Dot notation reads/writes properties; <code>delete</code> removes one.",
    "Destructuring pulls properties into variables. Nested destructuring goes one level deeper: <code>{ address: { city } }</code>. Renaming uses a colon: <code>{ name: userName }</code>.",
    "Insight: the user is a <code>const</code>, yet I can change its age and add email — <code>const</code> only protects the binding, not the object's contents.",
  ],
  (log) => {
    const user = {
      id: 1,
      name: "Shoqan",
      age: 21,
      address: { city: "Almaty", street: "Baiganin st. 27" },
    };

    log("user.name", user.name);
    log("user.address.city", user.address.city);

    user.age = 22;
    log("after user.age = 22", user.age);

    user.email = "tataev.shokan@gmail.com";
    log("after adding email", user.email);

    delete user.address.street;
    log("after delete street", user.address);

    const { name, age } = user;
    log("destructured { name, age }", { name, age });

    const { address: { city } } = user;
    log("nested destructuring → city", city);

    const { name: userName } = user;
    log("renamed { name: userName }", userName);

    log("final user", user);
  }
);

/* ------------------------------------------------------------------ */
/* 5 — Values and References                                           */
/* ------------------------------------------------------------------ */
task(
  "5 — Values and References",
  [
    "<code>copy = original</code> does not copy anything — both variables point to the <b>same object</b> in memory, so changing one changes the other.",
    "Spread <code>{ ...original }</code> creates a new object, but it is a <b>shallow</b> copy: nested objects are still shared. That is why changing <code>city</code> through the spread copy leaked into the original.",
    "Fix: copy the nested level too — <code>{ ...user, address: { ...user.address } }</code> — or use <code>structuredClone(user)</code> for a full deep copy.",
  ],
  (log) => {
    const original = { name: "Alice", score: 10 };
    const copy = original;
    copy.score = 99;
    log("original after copy.score = 99", original);
    log("copy === original", copy === original);

    const spreadCopy = { ...original };
    spreadCopy.score = 50;
    log("spread copy", spreadCopy);
    log("original after changing spread copy", original);

    const user = { name: "Alice", address: { city: "Almaty" } };
    const shallow = { ...user };
    shallow.address.city = "Astana";
    log("user after changing city through shallow copy", user);
    log("shallow.address === user.address", shallow.address === user.address);

    const deep = { ...user, address: { ...user.address } };
    deep.address.city = "Shymkent";
    log("deep copy", deep);
    log("user after changing deep copy", user);

    const cloned = structuredClone(user);
    cloned.address.city = "Aktobe";
    log("structuredClone copy", cloned);
    log("user after changing structuredClone copy", user);
  }
);

/* ------------------------------------------------------------------ */
/* 6 — Functions                                                       */
/* ------------------------------------------------------------------ */
task(
  "6 — Functions",
  [
    "<code>function isEven()</code> is a declaration (hoisted — can be called before its line). Arrow functions are expressions assigned to a <code>const</code> and are not hoisted.",
    "Arrow functions with a single expression return it implicitly, so <code>(n) => n % 2 === 0</code> needs no <code>return</code>.",
  ],
  (log) => {
    // normal function syntax
    function isEven(number) {
      return number % 2 === 0;
    }
    function getFullName(firstName, lastName) {
      return `${firstName} ${lastName}`;
    }

    // same functions rewritten as arrow functions
    const isEvenArrow = (number) => number % 2 === 0;
    const getFullNameArrow = (firstName, lastName) => `${firstName} ${lastName}`;

    const calculatePrice = (price, quantity) => price * quantity;
    const calculateDiscount = (price, percent) => price - (price * percent) / 100;
    const getMax = (a, b) => (a > b ? a : b);

    log("isEven(4) / isEven(7)", [isEven(4), isEven(7)]);
    log("isEvenArrow(4) / isEvenArrow(7)", [isEvenArrow(4), isEvenArrow(7)]);
    log('getFullName("Shoqan", "Tatayev")', getFullName("Shoqan", "Tatayev"));
    log('getFullNameArrow("Shoqan", "Tatayev")', getFullNameArrow("Shoqan", "Tatayev"));
    log("calculatePrice(250, 4)", calculatePrice(250, 4));
    log("calculateDiscount(1000, 15)", calculateDiscount(1000, 15));
    log("getMax(8, 12)", getMax(8, 12));
  }
);

/* ------------------------------------------------------------------ */
/* 7 — Functions as Values                                             */
/* ------------------------------------------------------------------ */
task(
  "7 — Functions as Values",
  [
    "<b>Can functions be stored in variables?</b> Yes — functions are first-class values (objects), so <code>const add = (a, b) => a + b</code> is normal.",
    "<b>Can functions be passed to other functions?</b> Yes — <code>calculate</code> receives <code>operation</code> and calls it. A function passed like this is called a callback; <code>map</code>/<code>filter</code> work the same way.",
    "<b>add vs add():</b> <code>add</code> is the function itself (a reference); <code>add()</code> calls it and gives back the result. Passing <code>add()</code> to calculate would pass <code>NaN</code>, not the function.",
  ],
  (log) => {
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    const calculate = (a, b, operation) => operation(a, b);

    log("calculate(5, 3, add)", calculate(5, 3, add));
    log("calculate(5, 3, multiply)", calculate(5, 3, multiply));
    log("calculate(5, 3, (a, b) => a - b)", calculate(5, 3, (a, b) => a - b));
    log("typeof add", typeof add);
    log("add (the function)", add);
    log("add() called with nothing", add());
  }
);

/* ------------------------------------------------------------------ */
/* 8 — Scope                                                           */
/* ------------------------------------------------------------------ */
task(
  "8 — Scope",
  [
    "<b>Global scope</b> — variables declared outside any function/block; visible everywhere.",
    "<b>Function scope</b> — variables declared inside a function exist only while that function runs and only inside it.",
    "<b>Block scope</b> — <code>let</code>/<code>const</code> declared inside <code>{ }</code> (if, for, plain block) exist only inside that block.",
    "<b>var vs let vs const:</b> <code>var</code> is function-scoped and hoisted (that is why <code>varInBlock</code> is still readable after the block). <code>let</code> and <code>const</code> are block-scoped, so accessing them outside throws a <code>ReferenceError</code>. <code>const</code> additionally forbids reassignment.",
    "Insight: each inner <code>message</code> <i>shadows</i> the outer one — it does not overwrite it, which is why the global value is still \"global\" at the end.",
  ],
  (log) => {
    log("message at global level", message);

    function showScope() {
      const message = "function";
      log("message inside function", message);
      if (true) {
        const message = "block";
        log("message inside if-block", message);
      }
      log("message after the block (still function)", message);
    }
    showScope();
    log("message at global level after the call", message);

    {
      var varInBlock = "var";
      let letInBlock = "let";
      const constInBlock = "const";
    }
    log("varInBlock outside the block", varInBlock);
    try {
      log("letInBlock outside the block", letInBlock);
    } catch (e) {
      log("letInBlock outside the block", `${e.name}: ${e.message}`);
    }
    try {
      log("constInBlock outside the block", constInBlock);
    } catch (e) {
      log("constInBlock outside the block", `${e.name}: ${e.message}`);
    }
  }
);

/* ------------------------------------------------------------------ */
/* 9 — Closure                                                         */
/* ------------------------------------------------------------------ */
task(
  "9 — Closure",
  [
    "A closure is a function bundled together with the variables from the scope where it was created. When <code>createCounter</code> returns, its <code>count</code> does not disappear: the returned function still references it, so JavaScript keeps it alive.",
    "Each call to <code>createCounter()</code> runs the function again and creates a <b>fresh</b> <code>count</code>, which is why <code>counter2</code> starts from 1 independently.",
    "Insight: this is how React's <code>useState</code> keeps state “private” to a component — closures over the render scope.",
  ],
  (log) => {
    function createCounter() {
      let count = 0;
      return function () {
        count += 1;
        return count;
      };
    }

    const counter = createCounter();
    log("counter() three times", [counter(), counter(), counter()]);

    const counter2 = createCounter();
    log("counter2() (own count)", counter2());
    log("counter() again (still its own count)", counter());

    const createAdder = (value) => (number) => number + value;
    const addFive = createAdder(5);
    log("addFive(10)", addFive(10));
    log("addFive(20)", addFive(20));
  }
);

/* ------------------------------------------------------------------ */
/* 10 — Destructuring, Spread and Rest                                 */
/* ------------------------------------------------------------------ */
task(
  "10 — Destructuring, Spread and Rest",
  [
    "<b>Spread</b> (<code>...</code> on the right side / in a call) <i>expands</i> an array or object into individual elements: <code>[...numbers, 50]</code>, <code>{ ...user, age: 22 }</code>.",
    "<b>Rest</b> (<code>...</code> in parameters or on the left side of destructuring) <i>collects</i> the remaining values into an array: <code>sum(...numbers)</code>, <code>const [first, ...others] = arr</code>.",
    "Same syntax, opposite direction: spread unpacks, rest packs.",
  ],
  (log) => {
    const numbers = [10, 20, 30, 40];
    const [first, second] = numbers;
    log("first two values", { first, second });

    const user = { id: 1, name: "Anna", age: 21 };
    const { name, age } = user;
    log("{ name, age }", { name, age });

    const withFifty = [...numbers, 50];
    log("numbers + 50 (new array)", withFifty);
    log("numbers unchanged", numbers);

    const olderUser = { ...user, age: 22 };
    log("user with age 22", olderUser);

    const userWithEmail = { ...user, email: "anna@example.com" };
    log("user with email", userWithEmail);
    log("original user unchanged", user);

    const combined = [...numbers, ...[1, 2, 3]];
    log("combined arrays", combined);

    const sum = (...values) => values.reduce((acc, n) => acc + n, 0);
    log("sum(1, 2)", sum(1, 2));
    log("sum(1, 2, 3, 4)", sum(1, 2, 3, 4));
    log("sum(...numbers)", sum(...numbers));

    const [head, ...rest] = numbers;
    log("rest in destructuring [head, ...rest]", { head, rest });
  }
);

/* ------------------------------------------------------------------ */
/* 11 — Optional Chaining and Default Values                           */
/* ------------------------------------------------------------------ */
task(
  "11 — Optional Chaining and Default Values",
  [
    "<code>user.address.city</code> throws when <code>address</code> is missing, because you cannot read <code>.city</code> of <code>undefined</code>. <code>user.address?.city</code> short-circuits and returns <code>undefined</code> instead.",
    "<code>??</code> replaces a value only when it is <code>null</code> or <code>undefined</code>. <code>||</code> replaces <b>any falsy</b> value: <code>0</code>, <code>\"\"</code>, <code>false</code> too.",
    "Insight: for defaults like “quantity: 0” or “empty string is a valid input”, <code>||</code> silently swaps a real value for the default; <code>??</code> is the safer choice.",
  ],
  (log) => {
    const users = [
      { name: "Anna", address: { city: "Almaty" } },
      { name: "John" },
      { name: "Sara", address: {} },
    ];

    try {
      log("users[1].address.city", users[1].address.city);
    } catch (e) {
      log("users[1].address.city", `${e.name}: ${e.message}`);
    }

    users.forEach((u) => log(`${u.name} → address?.city`, u.address?.city));
    users.forEach((u) =>
      log(`${u.name} → address?.city ?? default`, u.address?.city ?? "City not specified")
    );

    const testValues = [0, "", false, null, undefined];
    const comparison = testValues.map((v) => ({
      value: v,
      "v || 'default'": v || "default",
      "v ?? 'default'": v ?? "default",
    }));
    log("|| vs ?? comparison", comparison);
  }
);

/* ------------------------------------------------------------------ */
/* Final Task                                                          */
/* ------------------------------------------------------------------ */
task(
  "Final Task — Students Report",
  [
    "Every helper is a pure function: it takes data and returns a new value, nothing is reassigned or pushed into the original array.",
    "<code>getStudentAverage</code> reuses <code>getAverage</code>, <code>getPassedStudents</code> reuses <code>getStudentAverage</code> — small composable functions instead of one big loop.",
    "The final report is one <code>map</code> that builds a fresh <code>{ id, name, average, passed }</code> per student. Averages are rounded to one decimal for readability.",
  ],
  (log) => {
    const PASS_MARK = 70;

    const students = [
      { id: 1, name: "Anna", age: 20, grades: [85, 90, 78] },
      { id: 2, name: "John", age: 22, grades: [62, 70, 58] },
      { id: 3, name: "Sara", age: 21, grades: [91, 95, 89] },
      { id: 4, name: "Mike", age: 23, grades: [55, 60, 48] },
      { id: 5, name: "Dana", age: 20, grades: [72, 68, 80] },
    ];

    const getAverage = (grades) =>
      grades.length ? grades.reduce((acc, g) => acc + g, 0) / grades.length : 0;
    const getStudentAverage = (student) => getAverage(student.grades);
    const getPassedStudents = (list) => list.filter((s) => getStudentAverage(s) >= PASS_MARK);
    const getStudentNames = (list) => list.map((s) => s.name);
    const findStudent = (list, id) => list.find((s) => s.id === id);
    const getTopStudent = (list) =>
      list.reduce((top, s) => (getStudentAverage(s) > getStudentAverage(top) ? s : top));

    const round = (n) => Math.round(n * 10) / 10;

    log("getAverage([85, 90, 78])", round(getAverage([85, 90, 78])));
    log("getStudentAverage(students[1])", round(getStudentAverage(students[1])));
    log("getPassedStudents → names", getStudentNames(getPassedStudents(students)));
    log("getStudentNames", getStudentNames(students));
    log("findStudent(students, 3)", findStudent(students, 3));
    log("findStudent(students, 42)", findStudent(students, 42));
    log("getTopStudent", getTopStudent(students));

    const report = students.map(({ id, name }) => {
      const average = round(getStudentAverage(findStudent(students, id)));
      return { id, name, average, passed: average >= PASS_MARK };
    });
    log("final report", report);
    log("original students unchanged", students);
  }
);

/* =========================================================================
   Rendering
   ========================================================================= */

function format(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "function") return value.toString();
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "object" && value !== null) {
    const compact = JSON.stringify(value, replacer);
    return compact.length > 70 ? JSON.stringify(value, replacer, 2) : compact;
  }
  return String(value);
}
function replacer(_, v) {
  if (v === undefined) return "undefined";
  if (typeof v === "function") return `ƒ ${v.name || "anonymous"}`;
  return v;
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderTask({ title, notes, run }, index) {
  const section = el("section", "task");
  section.id = `task-${index}`;
  section.appendChild(el("h2", null, title));

  const rows = el("dl", "rows");
  const log = (label, value, type) => {
    console.log(`[${title}] ${label}:`, value, type ?? "");
    const dt = el("dt", null, label);
    const dd = el("dd");
    const pre = el("pre", "value");
    pre.textContent = format(value);
    dd.appendChild(pre);
    if (type !== undefined) dd.appendChild(el("span", "type", `typeof → ${type}`));
    rows.append(dt, dd);
  };

  try {
    run(log);
  } catch (e) {
    log("Unexpected error", `${e.name}: ${e.message}`);
  }
  section.appendChild(rows);

  const notesBox = el("div", "notes");
  notesBox.appendChild(el("h3", null, "Notes & insights"));
  const ul = el("ul");
  notes.forEach((n) => ul.appendChild(el("li", null, n)));
  notesBox.appendChild(ul);
  section.appendChild(notesBox);

  const details = el("details", "source");
  details.appendChild(el("summary", null, "Show source code"));
  const code = el("pre");
  code.textContent = run.toString();
  details.appendChild(code);
  section.appendChild(details);

  return section;
}

function renderNav() {
  const nav = document.getElementById("nav");
  tasks.forEach((t, i) => {
    const a = el("a", null, t.title.split(" — ")[0]);
    a.href = `#task-${i}`;
    a.title = t.title;
    nav.appendChild(a);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  const main = document.getElementById("tasks");
  tasks.forEach((t, i) => main.appendChild(renderTask(t, i)));
});
