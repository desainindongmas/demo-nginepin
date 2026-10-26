const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../dist/app.js'), 'utf8');

// Test the actual application state and event handlers without a browser dependency.
// These checks do not replace visual and accessibility testing in a real browser.
function sandbox() {
  const nodes = new Map();
  const listeners = {};
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', value: '', classList: { add() {}, remove() {} }, close() {}, showModal() {}, addEventListener() {} });
    return nodes.get(selector);
  };
  const local = new Map();
  const context = vm.createContext({
    console, Date, Math, JSON, Number, String, Set, Array, encodeURIComponent,
    localStorage: { getItem: k => local.get(k) || null, setItem: (k,v) => local.set(k,v) },
    document: { querySelector: node, addEventListener: (name, fn) => { listeners[name] = fn; } },
    window: { scrollTo() {}, open() {}, location: {}, print() {} },
    setTimeout: () => 1, clearTimeout() {},
  });
  vm.runInContext(source, context);
  return { run: code => vm.runInContext(code, context), node, submit: id => listeners.submit({ preventDefault() {}, target: { id, checkValidity: () => true } }) };
}

function book(s) {
  s.node('#guest-name').value = 'Andi Pratama';
  s.node('#guest-phone').value = '081234560000';
  s.node('#guest-email').value = 'andi@example.com';
  s.run('createBooking()');
}

test('guest booking appears unchanged for admin and increases owner revenue', () => {
  const s = sandbox();
  assert.equal(s.run('state.bookings.length'), 30);
  const before = s.run('totals().revenue');
  book(s);
  assert.equal(s.run('state.bookings.length'), 31);
  assert.equal(s.run('picked().total'), 2700000);
  assert.equal(s.run('picked().paid'), 1350000);
  assert.equal(s.run('totals().revenue'), before + 2700000);
  assert.equal(s.run('totals().outstanding'), 5600000);
  s.run("navigate('today', 'Admin')");
  assert.match(s.node('#app').innerHTML, /Andi Pratama/);
  s.run("navigate('booking', 'Admin')");
  assert.match(s.node('#app').innerHTML, /Rp1\.350\.000/);
});

test('recording final payment sets outstanding to zero and invoice LUNAS', () => {
  const s = sandbox();
  book(s);
  s.node('#pay-amount').value = '1350000';
  s.node('#pay-method').value = 'Bank transfer';
  s.submit('payment-form');
  assert.equal(s.run('picked().paid'), 2700000);
  assert.equal(s.run('picked().total - picked().paid'), 0);
  assert.equal(s.run('picked().payments.length'), 2);
  assert.equal(s.run('totals().outstanding'), 4250000);
  s.run("navigate('invoice', 'Admin')");
  assert.match(s.node('#app').innerHTML, /LUNAS/);
  assert.match(s.node('#app').innerHTML, /Rp0/);
});

test('overpayments and nonpositive payments leave records unchanged', () => {
  const s = sandbox();
  book(s);
  for (const value of ['2000000', '0', '-100', 'not-a-number']) {
    s.node('#pay-amount').value = value;
    s.node('#pay-method').value = 'Bank transfer';
    s.submit('payment-form');
    assert.equal(s.run('picked().paid'), 1350000);
    assert.equal(s.run('picked().payments.length'), 1);
  }
});

test('availability prevents overlapping bookings and permits checkout-day arrivals', () => {
  const s = sandbox();
  book(s);
  assert.equal(s.run('conflict(1)'), true);
  book(s);
  assert.equal(s.run('state.bookings.length'), 31);
  s.run("state.checkin='2026-11-14';state.checkout='2026-11-16'");
  assert.equal(s.run('conflict(1)'), false);
  s.run("state.checkin='2026-11-12';state.checkout='2026-11-14';picked().status='Dibatalkan'");
  assert.equal(s.run('conflict(1)'), false);
});

test('Enterprise aggregates the three properties from the shared source', () => {
  const s = sandbox();
  s.run("state.plan='Enterprise';state.property=-1");
  assert.equal(s.run('totals().revenue'), 102700000);
  assert.equal(s.run('totals().outstanding'), 9800000);
  assert.equal(s.run("available('portfolio')"), true);
  s.run("switchPlan('Standard')");
  assert.equal(s.run('state.property'), 0);
  assert.equal(s.run("available('portfolio')"), false);
  assert.equal(s.run("available('crm')"), false);
});

test('monthly and yearly plans preserve locked prices and savings', () => {
  const s = sandbox();
  let html = s.run('plans()');
  for (const amount of ['Rp249.000','Rp449.000','Rp999.000','Rp200.000','Rp348.000']) assert.ok(html.includes(amount), amount);
  s.run('state.yearly=true');
  html = s.run('plans()');
  for (const amount of ['Rp2.490.000','Rp4.490.000','Rp9.990.000','Rp2.000.000','Rp3.480.000']) assert.ok(html.includes(amount), amount);
});

test('guest input is escaped in the admin interface', () => {
  const s = sandbox();
  book(s);
  s.run("picked().name='<img src=x onerror=alert(1)>'");
  const html = s.run('detail()');
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('<img src=x'));
});

test('all demo page views render without runtime errors', () => {
  const s = sandbox();
  book(s);
  const views = ['overview','today','bookings','guest','unit','checkout','confirmation','booking','invoice','calendar','housekeeping','finance','guests','crm','automation','rules','portfolio','central','team','pricing','calculator','contact'];
  s.run("state.plan='Enterprise'");
  for (const page of views) {
    s.run(`navigate('${page}', '${['guest','unit','checkout','confirmation'].includes(page)?'Guest':'Owner'}')`);
    assert.ok(s.node('#app').innerHTML.length > 1000, page);
  }
});

test('guided housekeeping continues to owner before introducing the Pro upgrade', () => {
  const s = sandbox();
  book(s);
  s.run("state.guided=true;state.step=4;state.page='housekeeping';state.role='Admin';next()");
  assert.equal(s.run('state.page'), 'overview');
  assert.equal(s.run('state.role'), 'Owner');
  assert.equal(s.run('state.step'), 4);
  s.run('next()');
  assert.equal(s.run('state.step'), 5);
  assert.match(s.node('#modal').innerHTML, /STANDARD/);
});
