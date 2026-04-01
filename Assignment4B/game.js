/**
 * PROG 2700 – Assignment 4B  ·  Three In A Row
 * All code lives inside an IIFE – nothing leaks into global scope.
 */
(function () {

  const API_BASE = 'https://prog2700.onrender.com/threeinarow/';

  const EMPTY = 0;
  const BLUE  = 1;
  const WHITE = 2;

  let puzzleData = null;
  let secondsElapsed = 0;
  let timerInterval = null;
  let timerStarted = false;
  let hintsRemaining = 3;

  // ── Bootstrap ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildUI();
    loadPuzzle('sample');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PUZZLE LOADING
  // ─────────────────────────────────────────────────────────────────────────────
  function loadPuzzle(sizeKey) {
    resetTimer();
    hintsRemaining = 3;
    updateHintBtn();
    clearStatus();
    setStatus('Loading…', '');

    fetch(API_BASE + sizeKey)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rawData) {
        puzzleData = normalise(rawData);
        renderTable();
        clearStatus();
      })
      .catch(function (err) {
        console.error('Fetch error:', err);
        setStatus('Could not reach server – please try again.', 'error');
      });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NORMALISE
  // API format: { rows: [ [ { currentState, correctState, canToggle }, … ], … ] }
  //   currentState : 0=empty, 1=blue, 2=white   (what to display now)
  //   correctState : 0=empty, 1=blue, 2=white   (solution)
  //   canToggle    : false = cell is locked (pre-filled)
  // ─────────────────────────────────────────────────────────────────────────────
  function normalise(data) {
    // Unwrap { rows: [...] }
    var grid = Array.isArray(data) ? data
             : (data && Array.isArray(data.rows)) ? data.rows
             : null;

    if (!grid || !Array.isArray(grid[0])) {
      console.error('Unrecognised puzzle format:', data);
      return [];
    }

    return grid.map(function (row) {
      return row.map(function (cell) {
        return {
          value: Number(cell.currentState),   // current display value
          solution: Number(cell.correctState),   // correct answer
          locked: !cell.canToggle,             // false canToggle → locked
        };
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI CONSTRUCTION
  // ─────────────────────────────────────────────────────────────────────────────
  function buildUI() {
    var gameDiv = document.getElementById('theGame');

    var title = document.createElement('h1');
    title.textContent = 'Three In A Row';
    gameDiv.appendChild(title);

    var rules = document.createElement('p');
    rules.id = 'rulesText';
    rules.textContent =
      'No three identical colours in a row or column. ' +
      'Each row & column must contain equal numbers of blue and white squares.';
    gameDiv.appendChild(rules);

    // ── Controls ───────────────────────────────────────────────────────────────
    var controls = document.createElement('div');
    controls.id = 'controls';

    // Size selector (innovative feature – change puzzle size without refreshing)
    var sizeGroup = document.createElement('div');
    sizeGroup.className = 'control-group';
    var sizeLabel = document.createElement('label');
    sizeLabel.setAttribute('for', 'sizeSelect');
    sizeLabel.textContent = 'Puzzle size:';
    var sizeSelect = document.createElement('select');
    sizeSelect.id = 'sizeSelect';
    [
      { value: 'sample', text: '6×6 (Sample)'},
      { value: 'random', text: 'Random'},
      { value: '6x6',   text: '6×6'},
      { value: '8x8',   text: '8×8'},
      { value: '10x10', text: '10×10'},
      { value: '12x12', text: '12×12'},
      { value: '14x14', text: '14×14'},
    ].forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.text;
      sizeSelect.appendChild(o);
    });
    sizeSelect.addEventListener('change', function () { loadPuzzle(this.value); });
    sizeGroup.appendChild(sizeLabel);
    sizeGroup.appendChild(sizeSelect);
    controls.appendChild(sizeGroup);

    var checkBtn = document.createElement('button');
    checkBtn.id = 'checkBtn';
    checkBtn.textContent = 'Check Puzzle';
    checkBtn.addEventListener('click', checkPuzzle);
    controls.appendChild(checkBtn);

    var resetBtn = document.createElement('button');
    resetBtn.id = 'resetBtn';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', resetPuzzle);
    controls.appendChild(resetBtn);

    // Show-errors checkbox
    var errorGroup = document.createElement('div');
    errorGroup.className = 'control-group';
    var errorCb = document.createElement('input');
    errorCb.type = 'checkbox';
    errorCb.id = 'showErrors';
    errorCb.addEventListener('change', function () {
      this.checked ? highlightErrors() : clearErrorHighlights();
    });
    var errorLbl = document.createElement('label');
    errorLbl.setAttribute('for', 'showErrors');
    errorLbl.textContent = 'Show errors';
    errorGroup.appendChild(errorCb);
    errorGroup.appendChild(errorLbl);
    controls.appendChild(errorGroup);

    // Hint button (innovative feature)
    var hintBtn = document.createElement('button');
    hintBtn.id = 'hintBtn';
    hintBtn.textContent = 'Hint (3 left)';
    hintBtn.addEventListener('click', giveHint);
    controls.appendChild(hintBtn);

    gameDiv.appendChild(controls);

    // ── Info row ───────────────────────────────────────────────────────────────
    var infoRow = document.createElement('div');
    infoRow.id = 'infoRow';
    var statusMsg = document.createElement('span');
    statusMsg.id = 'statusMessage';
    var timerEl = document.createElement('span');
    timerEl.id = 'timer';
    timerEl.textContent = '⏱ 0:00';
    infoRow.appendChild(statusMsg);
    infoRow.appendChild(timerEl);
    gameDiv.appendChild(infoRow);

    // ── Table container ────────────────────────────────────────────────────────
    var tc = document.createElement('div');
    tc.id = 'tableContainer';
    gameDiv.appendChild(tc);

    // ── Legend ─────────────────────────────────────────────────────────────────
    var legend = document.createElement('div');
    legend.id = 'legend';
    [
      { cls: 'blue  clickable', label: '= Blue (1st click)'  },
      { cls: 'white clickable', label: '= White (2nd click)' },
      { cls: 'empty clickable', label: '= Clear (3rd click)' },
      { cls: 'empty locked',    label: '= Locked (fixed)'    },
    ].forEach(function (item) {
      var wrap   = document.createElement('span');
      wrap.className = 'legend-item';
      var swatch = document.createElement('span');
      swatch.className = 'cell swatch ' + item.cls;
      var lbl = document.createElement('span');
      lbl.textContent = item.label;
      wrap.appendChild(swatch);
      wrap.appendChild(lbl);
      legend.appendChild(wrap);
    });
    gameDiv.appendChild(legend);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TABLE RENDERING
  // ─────────────────────────────────────────────────────────────────────────────
  function renderTable() {
    var container = document.getElementById('tableContainer');
    container.innerHTML = '';

    var rows = puzzleData.length;
    var cols = puzzleData[0].length;
    var cellPx = Math.max(26, Math.floor(560 / Math.max(rows, cols)));

    var table = document.createElement('table');
    table.id = 'puzzleTable';
    table.style.setProperty('--cell-size', cellPx + 'px');

    for (var r = 0; r < rows; r++) {
      var tr = document.createElement('tr');
      for (var c = 0; c < cols; c++) {
        var td = document.createElement('td');
        td.dataset.row = r;
        td.dataset.col = c;
        applyClass(td, puzzleData[r][c]);
        if (!puzzleData[r][c].locked) {
          td.addEventListener('click', handleCellClick);
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    container.appendChild(table);

    var cb = document.getElementById('showErrors');
    if (cb) cb.checked = false;
  }

  function applyClass(td, cell) {
    var colour = cell.value === BLUE ? 'blue' : cell.value === WHITE ? 'white' : 'empty';
    td.className = 'cell ' + colour + (cell.locked ? ' locked' : ' clickable');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CELL CLICK
  // ─────────────────────────────────────────────────────────────────────────────
  function handleCellClick(e) {
    if (!timerStarted) startTimer();
    var td = e.currentTarget;
    var r = parseInt(td.dataset.row, 10);
    var c = parseInt(td.dataset.col, 10);
    var cell = puzzleData[r][c];
    cell.value = (cell.value + 1) % 3;   // EMPTY→BLUE→WHITE→EMPTY
    applyClass(td, cell);
    var cb = document.getElementById('showErrors');
    if (cb && cb.checked) highlightErrors();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────────────────────────
  function resetPuzzle() {
    if (!puzzleData) return;
    var table = document.getElementById('puzzleTable');
    puzzleData.forEach(function (row, r) {
      row.forEach(function (cell, c) {
        if (!cell.locked) {
          cell.value = EMPTY;
          applyClass(table.rows[r].cells[c], cell);
        }
      });
    });
    clearErrorHighlights();
    clearStatus();
    resetTimer();
    hintsRemaining = 3;
    updateHintBtn();
    var cb = document.getElementById('showErrors');
    if (cb) cb.checked = false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CHECK PUZZLE
  // ─────────────────────────────────────────────────────────────────────────────
  function checkPuzzle() {
    if (!puzzleData) return;
    var rows = puzzleData.length;
    var cols = puzzleData[0].length;
    var hasEmpty = false;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (!puzzleData[r][c].locked && puzzleData[r][c].value === EMPTY) {
          hasEmpty = true;
        }
      }
    }

    if (gridViolatesRules()) {
      setStatus('Something is wrong! ✗', 'error');
    } else if (hasEmpty) {
      setStatus('So far so good! Keep going… ✓', 'ok');
    } else {
      setStatus('You did it!! 🎉  Puzzle solved!', 'success');
      stopTimer();
    }
  }

  function gridViolatesRules() {
    var rows = puzzleData.length;
    var cols = puzzleData[0].length;

    // Rule 1: no three consecutive same colour
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var v = puzzleData[r][c].value;
        if (v === EMPTY) continue;
        if (c + 2 < cols && puzzleData[r][c+1].value === v && puzzleData[r][c+2].value === v) return true;
        if (r + 2 < rows && puzzleData[r+1][c].value === v && puzzleData[r+2][c].value === v) return true;
      }
    }

    // Rule 2: completed rows/cols must have equal blue & white
    for (var r2 = 0; r2 < rows; r2++) {
      var rowVals = puzzleData[r2].map(function (cell) { return cell.value; });
      if (rowVals.indexOf(EMPTY) === -1) {
        if (rowVals.filter(function (v) { return v === BLUE;  }).length !==
            rowVals.filter(function (v) { return v === WHITE; }).length) return true;
      }
    }
    for (var c2 = 0; c2 < cols; c2++) {
      var colVals = puzzleData.map(function (row) { return row[c2].value; });
      if (colVals.indexOf(EMPTY) === -1) {
        if (colVals.filter(function (v) { return v === BLUE;  }).length !==
            colVals.filter(function (v) { return v === WHITE; }).length) return true;
      }
    }
    return false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ERROR HIGHLIGHTING
  // ─────────────────────────────────────────────────────────────────────────────
  function highlightErrors() {
    clearErrorHighlights();
    if (!puzzleData) return;
    var table = document.getElementById('puzzleTable');
    var rows  = puzzleData.length;
    var cols  = puzzleData[0].length;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = puzzleData[r][c];
        if (!cell.locked && cell.value !== EMPTY && cellIsWrong(r, c)) {
          table.rows[r].cells[c].classList.add('error');
        }
      }
    }
  }

  function cellIsWrong(r, c) {
    var v    = puzzleData[r][c].value;
    var rows = puzzleData.length;
    var cols = puzzleData[0].length;

    // Part of a horizontal triple?
    for (var s = Math.max(0, c-2); s <= Math.min(cols-3, c); s++) {
      if (puzzleData[r][s].value === v && puzzleData[r][s+1].value === v && puzzleData[r][s+2].value === v) return true;
    }
    // Part of a vertical triple?
    for (var t = Math.max(0, r-2); t <= Math.min(rows-3, r); t++) {
      if (puzzleData[t][c].value === v && puzzleData[t+1][c].value === v && puzzleData[t+2][c].value === v) return true;
    }
    // Wrong balance in completed row?
    var rowVals = puzzleData[r].map(function (cell) { return cell.value; });
    if (rowVals.indexOf(EMPTY) === -1) {
      if (rowVals.filter(function (x) { return x === BLUE;  }).length !==
          rowVals.filter(function (x) { return x === WHITE; }).length) return true;
    }
    // Wrong balance in completed column?
    var colVals = puzzleData.map(function (row) { return row[c].value; });
    if (colVals.indexOf(EMPTY) === -1) {
      if (colVals.filter(function (x) { return x === BLUE;  }).length !==
          colVals.filter(function (x) { return x === WHITE; }).length) return true;
    }
    return false;
  }

  function clearErrorHighlights() {
    var cells = document.querySelectorAll('#puzzleTable td.error');
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.remove('error');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HINT SYSTEM  (Innovative Feature)
  // Uses correctState from the API to reveal one random empty cell's answer.
  // Players get 3 hints per puzzle.
  // ─────────────────────────────────────────────────────────────────────────────
  function giveHint() {
    if (hintsRemaining <= 0 || !puzzleData) return;

    // Collect all empty, unlocked cells
    var candidates = [];
    puzzleData.forEach(function (row, r) {
      row.forEach(function (cell, c) {
        if (!cell.locked && cell.value === EMPTY) {
          candidates.push({ r: r, c: c });
        }
      });
    });

    if (candidates.length === 0) {
      setStatus('No empty cells left to hint!', 'ok');
      return;
    }

    // Pick a random candidate and reveal its correctState
    var pick = candidates[Math.floor(Math.random() * candidates.length)];
    var cell = puzzleData[pick.r][pick.c];

    if (cell.solution === undefined || cell.solution === EMPTY) {
      setStatus('No hint available for that cell.', 'ok');
      return;
    }

    cell.value = cell.solution;
    var td = document.getElementById('puzzleTable').rows[pick.r].cells[pick.c];
    applyClass(td, cell);
    td.classList.add('hinted');
    setTimeout(function () { td.classList.remove('hinted'); }, 1800);

    hintsRemaining--;
    updateHintBtn();

    var cb = document.getElementById('showErrors');
    if (cb && cb.checked) highlightErrors();
  }

  function updateHintBtn() {
    var btn = document.getElementById('hintBtn');
    if (!btn) return;
    btn.textContent = 'Hint (' + hintsRemaining + ' left)';
    btn.disabled    = (hintsRemaining <= 0);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TIMER  (Innovative Feature)
  // ─────────────────────────────────────────────────────────────────────────────
  function startTimer() {
    timerStarted  = true;
    timerInterval = setInterval(function () { secondsElapsed++; refreshTimerDisplay(); }, 1000);
  }
  function stopTimer()  { clearInterval(timerInterval); timerInterval = null; }
  function resetTimer() { stopTimer(); secondsElapsed = 0; timerStarted = false; refreshTimerDisplay(); }
  function refreshTimerDisplay() {
    var el = document.getElementById('timer');
    if (!el) return;
    var m = Math.floor(secondsElapsed / 60);
    var s = secondsElapsed % 60;
    el.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────────────────────
  function setStatus(msg, type) {
    var el = document.getElementById('statusMessage');
    if (!el) return;
    el.textContent = msg;
    el.className   = type || '';
  }
  function clearStatus() { setStatus('', ''); }

})();