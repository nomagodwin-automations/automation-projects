/* =========================================================
   TIP FRONTEND
   Handles identity capture, PDF upload, story rendering,
   breakdown view, and PDF export for the TIP experience.
   ========================================================= */

const CONFIG = {
  IDENTITY_WEBHOOK:
    "https://noma-automations003.app.n8n.cloud/webhook/tip-identity",
  MAIN_WEBHOOK: "https://noma-automations003.app.n8n.cloud/webhook/tipupload",
};

/* ------------------------------------------------------------------
   STATE
   Stores the current user, selected file, parsed story, and UI state.
------------------------------------------------------------------ */
let STATE = {
  user: null,
  file: null,
  story: null,
  transactions: [],
  cardIndex: 0,
  totalCards: 0,
};

let dropZoneInitialized = false;
let processingTimer = null;

/* ------------------------------------------------------------------
   DOM HELPERS
   Small utilities for safe DOM access and content rendering.
------------------------------------------------------------------ */
function getEl(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/* ------------------------------------------------------------------
   SCREEN NAVIGATION
   Controls which screen is visible in the single-page experience.
------------------------------------------------------------------ */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    if (screen.id === id) {
      screen.classList.remove("exit");
      screen.classList.add("active");
    } else {
      screen.classList.remove("active");
    }
  });
}

function showStory() {
  showScreen("s-story");
}

function showBreakdown() {
  showScreen("s-breakdown");
}

/* ------------------------------------------------------------------
   SCREEN 1 — IDENTITY
   Collects the user's name and phone number, then sends them to the
   identity webhook and stores the result locally.
------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("tip_user");

  if (stored) {
    try {
      const user = JSON.parse(stored);
      STATE.user = {
        id: user?.id || user?.user_id || null,
        name: user?.name || "",
        phone: user?.phone || "",
        upload_count: user?.upload_count || 0,
        is_new: user?.is_new_user || false,
      };

      if (STATE.user.id) {
        renderUploadScreen();
        showScreen("s-upload");
      } else {
        STATE.user = null;
        localStorage.removeItem("tip_user");
      }
    } catch (error) {
      console.warn("Failed to restore stored user:", error);
      localStorage.removeItem("tip_user");
    }
  }

  setupDropZone();
});

async function handleIdentity() {
  const name = getEl("inp-name").value.trim();
  const phone = getEl("inp-phone").value.trim();
  const btn = getEl("identity-btn");
  const err = getEl("identity-error");

  showErr(err, "");

  if (!name) {
    showErr(err, "Tell us your name first.");
    return;
  }

  if (!phone) {
    showErr(err, "We need your phone number to remember you.");
    return;
  }

  setIdentityButtonState(btn, true);

  try {
    const res = await fetch(CONFIG.IDENTITY_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    if (!res.ok) {
      throw new Error(`Identity request failed with ${res.status}`);
    }

    const data = await parseJsonResponse(res);
    const user = Array.isArray(data) ? data[0] : data;

    STATE.user = {
      id: user?.id || user?.user_id || null,
      name: user?.name || name,
      phone: user?.phone || phone,
      upload_count: user?.upload_count || 0,
      is_new: user?.is_new_user || false,
    };

    localStorage.setItem("tip_user", JSON.stringify(STATE.user));
    renderUploadScreen();
    showScreen("s-upload");
  } catch (error) {
    console.error(error);
    showErr(err, "Couldn't reach the server. Check your connection.");
    setIdentityButtonState(btn, false);
  }
}

function setIdentityButtonState(btn, isLoading) {
  btn.textContent = isLoading ? "One sec…" : "Continue";
  btn.disabled = isLoading;
}

function showErr(el, msg) {
  if (!msg) {
    el.textContent = "";
    el.classList.add("hidden");
    return;
  }

  el.textContent = msg;
  el.classList.remove("hidden");
}

/* ------------------------------------------------------------------
   SCREEN 2 — UPLOAD
   Lets the user select a PDF statement, previews the file, and shows
   previous upload hints when available.
------------------------------------------------------------------ */
function renderUploadScreen() {
  const user = STATE.user || {};
  getEl("upload-greeting").textContent = user.name
    ? `Welcome back, ${user.name} 👋`
    : "Welcome 👋";

  const prevUploads = getEl("prev-uploads");
  const prevList = getEl("prev-list");

  if (user.upload_count > 0) {
    prevUploads.classList.remove("hidden");
    prevList.innerHTML = `
      <div class="prev-item">
        <strong>${user.upload_count} statement${user.upload_count > 1 ? "s" : ""} uploaded so far</strong>
        <span>keep the history growing →</span>
      </div>`;
  } else {
    prevUploads.classList.add("hidden");
    prevList.innerHTML = "";
  }
}

function setupDropZone() {
  if (dropZoneInitialized) return;
  dropZoneInitialized = true;

  const zone = getEl("drop-zone");
  const input = getEl("file-input");

  input.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  });

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("dragover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("dragover");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("dragover");

    const file = event.dataTransfer?.files?.[0];
    if (file) setFile(file);
  });
}

function setFile(file) {
  if (!file) return;

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    alert("Please upload a PDF statement.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Please keep the file under 10MB.");
    return;
  }

  STATE.file = file;
  getEl("drop-zone").classList.add("hidden");
  const preview = getEl("file-preview");
  preview.classList.remove("hidden");
  getEl("file-name-display").textContent = file.name;
  getEl("upload-btn").disabled = false;
}

function clearFile() {
  STATE.file = null;
  getEl("drop-zone").classList.remove("hidden");
  getEl("file-preview").classList.add("hidden");
  getEl("file-input").value = "";
  getEl("upload-btn").disabled = true;
}

/* ------------------------------------------------------------------
   PROCESSING COPY ROTATION
   Shows a friendly animated loading message while the backend works.
------------------------------------------------------------------ */
const PROCESSING_LINES = [
  "Reading your statement…",
  "Figuring out where the money went…",
  "Resolving merchants…",
  "Detecting your spending patterns…",
  "Writing your financial story…",
  "Almost done — this one's interesting 👀",
];

function startProcessingCopy() {
  stopProcessingCopy();

  let index = 0;
  const el = getEl("processing-copy");
  el.textContent = PROCESSING_LINES[0];

  processingTimer = setInterval(() => {
    index = (index + 1) % PROCESSING_LINES.length;
    el.style.opacity = 0;

    setTimeout(() => {
      el.textContent = PROCESSING_LINES[index];
      el.style.opacity = 1;
    }, 400);
  }, 4500);
}

function stopProcessingCopy() {
  if (processingTimer) {
    clearInterval(processingTimer);
    processingTimer = null;
  }
}

/* ------------------------------------------------------------------
   SCREEN 3 — MAIN WEBHOOK CALL
   Sends the uploaded PDF to the main webhook and prepares the story
   and transaction data for rendering.
------------------------------------------------------------------ */
async function handleUpload() {
  if (!STATE.file || !STATE.user) return;

  const uploadBtn = getEl("upload-btn");
  uploadBtn.disabled = true;
  uploadBtn.textContent = "Processing…";

  showScreen("s-processing");
  startProcessingCopy();

  const uploadId = crypto.randomUUID();

  // Guard — don't proceed if identity wasn't resolved
  if (!STATE.user || !STATE.user.id) {
    alert("Session expired. Please refresh and try again.");
    showScreen("s-identity");
    return;
  }

  const form = new FormData();
  form.append("data", STATE.file);
  form.append("user_id", STATE.user.id);
  form.append("upload_id", uploadId);
  try {
    const res = await fetch(CONFIG.MAIN_WEBHOOK, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Upload request failed with ${res.status}`);
    }

    const raw = await parseJsonResponse(res);
    const data = Array.isArray(raw) ? raw[0] : raw;

    if (!data || typeof data !== "object") {
      throw new Error("The server returned an invalid story payload.");
    }

    stopProcessingCopy();
    STATE.story = data;
    STATE.transactions = Array.isArray(data.transactions)
      ? data.transactions
      : [];

    STATE.user.upload_count = (STATE.user.upload_count || 0) + 1;
    localStorage.setItem("tip_user", JSON.stringify(STATE.user));

    renderStoryCards(data);
    renderBreakdown(STATE.transactions);
    showScreen("s-story");
  } catch (error) {
    console.error(error);
    stopProcessingCopy();
    showScreen("s-upload");
    alert("Something went wrong processing your statement. Try again.");
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Read My Finances";
  }
}

/* ------------------------------------------------------------------
   SCREEN 4 — STORY CARDS
   Builds the swipeable story cards from the backend response.
------------------------------------------------------------------ */
function renderStoryCards(story) {
  const track = getEl("cards-track");
  const strips = getEl("progress-strips");
  const dots = getEl("dots-nav");

  track.innerHTML = "";
  strips.innerHTML = "";
  dots.innerHTML = "";

  const cards = buildCardDefs(story);
  STATE.totalCards = cards.length;
  STATE.cardIndex = 0;

  cards.forEach((card, index) => {
    track.insertAdjacentHTML("beforeend", buildCardHTML(card, index));

    const strip = document.createElement("div");
    strip.className = `strip${index === 0 ? " active" : ""}`;
    strip.innerHTML = '<div class="strip-fill"></div>';
    strips.appendChild(strip);

    const dot = document.createElement("div");
    dot.className = `dot${index === 0 ? " active" : ""}`;
    dot.onclick = () => goToCard(index);
    dots.appendChild(dot);
  });

  track.onscroll = onTrackScroll;
}

function buildCardDefs(story) {
  const cards = [];

  cards.push({
    type: "headline",
    eyebrow: formatMonthYear(story.month_year),
    title: story.headline || "Here's your month.",
    value: null,
    insight: story.summary || "",
    tag: "Your Financial Story",
    tagClass: "tag-headline",
  });

  (story.cards || []).forEach((card) => {
    cards.push({
      type: card.type,
      eyebrow: eyebrowByType(card.type),
      title: card.title,
      value: card.value,
      insight: card.insight,
      tag: labelByType(card.type),
      tagClass: `tag-${card.type}`,
    });
  });

  return cards;
}

function buildCardHTML(card, index) {
  return `
    <div class="story-card type-${card.type}" data-index="${index}">
      <div class="card-eyebrow">${escapeHtml(card.eyebrow)}</div>
      <div class="card-tag ${card.tagClass}">${escapeHtml(card.tag)}</div>
      <div class="card-title">${escapeHtml(card.title)}</div>
      ${card.value ? `<div class="card-value">${escapeHtml(card.value)}</div>` : ""}
      <p class="card-insight">${escapeHtml(card.insight)}</p>
    </div>`;
}

function eyebrowByType(type) {
  return (
    {
      income: "Money In",
      spending: "Money Out",
      behaviour: "Your Habits",
      advice: "Worth Noting",
      comparison: "vs Last Month",
      headline: "",
    }[type] || ""
  );
}

function labelByType(type) {
  return (
    {
      income: "💚 Income",
      spending: "🟡 Spending",
      behaviour: "💜 Behaviour",
      advice: "🔴 Heads Up",
      comparison: "🔵 Comparison",
      headline: "✦ TIP",
    }[type] || type
  );
}

function formatMonthYear(value) {
  if (!value) return "";

  const [year, month] = value.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

/* ------------------------------------------------------------------
   CARD NAVIGATION
   Supports swiping and arrow-key navigation between story cards.
------------------------------------------------------------------ */
function onTrackScroll() {
  const track = getEl("cards-track");
  const index = Math.round(track.scrollLeft / track.offsetWidth);

  if (index !== STATE.cardIndex) {
    updateCardIndex(index);
  }
}

function navCard(direction) {
  const next = Math.max(
    0,
    Math.min(STATE.totalCards - 1, STATE.cardIndex + direction),
  );
  goToCard(next);
}

function goToCard(index) {
  const track = getEl("cards-track");
  track.scrollTo({ left: index * track.offsetWidth, behavior: "smooth" });
  updateCardIndex(index);
}

function updateCardIndex(index) {
  STATE.cardIndex = index;

  document.querySelectorAll(".dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  document.querySelectorAll(".strip").forEach((strip, stripIndex) => {
    strip.classList.remove("active", "done");

    if (stripIndex < index) strip.classList.add("done");
    if (stripIndex === index) strip.classList.add("active");
  });
}

document.addEventListener("keydown", (event) => {
  if (getEl("s-story").classList.contains("active")) {
    if (event.key === "ArrowRight") navCard(1);
    if (event.key === "ArrowLeft") navCard(-1);
  }
});

/* ------------------------------------------------------------------
   SCREEN 5 — TRANSACTION BREAKDOWN
   Renders the full breakdown table for the extracted transactions.
------------------------------------------------------------------ */
function renderBreakdown(txns) {
  const tbody = getEl("tx-tbody");
  const countBadge = getEl("tx-count-badge");
  const safeTransactions = Array.isArray(txns) ? txns : [];

  countBadge.textContent = `${safeTransactions.length} transactions`;

  tbody.innerHTML = safeTransactions
    .map(
      (tx) => `
    <tr>
      <td class="tx-date">${escapeHtml(tx.transaction_date || tx.date || "")}</td>
      <td>
        <div class="tx-merchant">${escapeHtml(tx.merchant_name || "—")}</div>
        <div class="tx-raw">${escapeHtml(tx.raw_description || "")}</div>
      </td>
      <td><span class="tx-cat">${escapeHtml(tx.category || "—")}</span></td>
      <td class="tx-amount ${escapeHtml(tx.type || "")}">
        ${tx.type === "debit" ? "−" : "+"}₦${Number(tx.amount || 0).toLocaleString()}
      </td>
    </tr>`,
    )
    .join("");
}

/* ------------------------------------------------------------------
   PDF EXPORT
   Downloads a polished report containing the story summary and
   the full transaction table.
------------------------------------------------------------------ */
function downloadPDF() {
  if (!window.jspdf || !STATE.story) {
    alert("No report is available yet.");
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const story = STATE.story;
    const txns = STATE.transactions;
    const width = doc.internal.pageSize.getWidth();
    let y = 20;

    const purple = [123, 97, 255];
    const dark = [18, 18, 25];
    const gray = [120, 120, 150];
    const white = [240, 240, 248];

    doc.setFillColor(...dark);
    doc.rect(0, 0, width, 40, "F");
    doc.setTextColor(...purple);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TIP", 14, 16);
    doc.setTextColor(...gray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Transaction Intelligence Platform", 14, 22);
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.text(
      `${STATE.user?.name || ""} · ${formatMonthYear(story?.month_year)}`,
      14,
      32,
    );
    doc.text(
      `Generated ${new Date().toLocaleDateString("en-GB")}`,
      width - 14,
      32,
      { align: "right" },
    );
    y = 52;

    doc.setTextColor(...purple);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const headline = story?.headline || "Your Financial Story";
    const wrapped = doc.splitTextToSize(headline, width - 28);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 8 + 4;

    if (story?.summary) {
      doc.setTextColor(...gray);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(story.summary, width - 28);
      doc.text(summaryLines, 14, y);
      y += summaryLines.length * 5 + 10;
    }

    doc.setDrawColor(...dark);
    doc.setLineWidth(0.3);
    doc.line(14, y, width - 14, y);
    y += 10;

    const cardTypeColors = {
      income: [0, 214, 143],
      spending: [255, 181, 71],
      behaviour: [123, 97, 255],
      advice: [255, 77, 109],
      comparison: [79, 195, 247],
    };

    (story?.cards || []).forEach((card) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      const color = cardTypeColors[card.type] || purple;
      doc.setFillColor(...color);
      doc.roundedRect(14, y - 2, 4, 18, 2, 2, "F");
      doc.setTextColor(...color);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(eyebrowByType(card.type).toUpperCase(), 22, y + 4);
      doc.setTextColor(50, 50, 70);
      doc.setFontSize(12);
      doc.text(card.title || "", 22, y + 10);

      if (card.value) {
        doc.setTextColor(...color);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(card.value, width - 14, y + 10, { align: "right" });
      }

      if (card.insight) {
        doc.setTextColor(...gray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const insightLines = doc.splitTextToSize(card.insight, width - 40);
        doc.text(insightLines, 22, y + 16);
        y += insightLines.length * 4 + 24;
      } else {
        y += 24;
      }
    });

    if (txns && txns.length > 0) {
      if (y > 220) {
        doc.addPage();
        y = 20;
      }

      doc.setTextColor(...gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("FULL TRANSACTION BREAKDOWN", 14, y);
      y += 6;

      doc.autoTable({
        startY: y,
        head: [["Date", "Merchant", "Category", "Type", "Amount (₦)"]],
        body: txns.map((tx) => [
          tx.transaction_date || tx.date || "",
          tx.merchant_name || tx.raw_description || "",
          tx.category || "",
          (tx.type || "").toUpperCase(),
          `${tx.type === "debit" ? "-" : "+"}${Number(tx.amount || 0).toLocaleString()}`,
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [50, 50, 70],
        },
        headStyles: {
          fillColor: dark,
          textColor: purple,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        columnStyles: { 4: { halign: "right" } },
        theme: "grid",
      });
    }

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      doc.setFontSize(7);
      doc.setTextColor(...gray);
      doc.text(
        "TIP — Transaction Intelligence Platform · Confidential",
        14,
        doc.internal.pageSize.getHeight() - 8,
      );
      doc.text(
        `Page ${page} of ${pageCount}`,
        width - 14,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" },
      );
    }

    const period = story?.month_year
      ? story.month_year.replace("-", "_")
      : "report";
    doc.save(`TIP_Report_${period}.pdf`);
  } catch (error) {
    console.error(error);
    alert("The PDF report could not be generated.");
  }
}
