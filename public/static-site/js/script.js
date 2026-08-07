/* ==========================================================================
   NATYAARAMBAM DANCE ACADEMY — shared interactions (vanilla JS)
   Every block guards for element existence, so one file serves all pages.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------- Toast ----------------------------- */
  var toastEl = document.querySelector("[data-toast]");
  var toastTimer = null;
  window.showToast = function (msg) {
    if (!toastEl) return;
    toastEl.querySelector("[data-toast-msg]").textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2800);
  };

  /* --------------------- Header state + progress -------------------- */
  var header = document.querySelector("[data-header]");
  var progress = document.querySelector("[data-progress]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 14);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------- Mobile menu -------------------------- */
  var menuBtn = document.querySelector("[data-menu-btn]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.querySelector("[data-icon-open]").style.display = open ? "none" : "";
      menuBtn.querySelector("[data-icon-close]").style.display = open ? "" : "none";
    });
    mobileMenu.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------- Scroll reveals ------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* --------------------- Generic data-toast-btn --------------------- */
  document.querySelectorAll("[data-toast-msg-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.showToast(btn.getAttribute("data-toast-msg-btn"));
    });
  });

  /* ---------------------- Heritage count-up (45+) ------------------- */
  var counter = document.querySelector("[data-count-to]");
  if (counter && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        cio.disconnect();
        var target = parseInt(counter.getAttribute("data-count-to"), 10) || 0;
        var start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / 1300, 1);
          counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      },
      { threshold: 0.5 }
    );
    cio.observe(counter);
  }

  /* ------------- Build testimonial cards from page data ------------- */
  var T_DATA = window.ND_TESTIMONIALS || [];
  function tCardHTML(t) {
    return (
      '<figure class="nd-card flex h-full flex-col p-7">' +
      '<div class="flex items-start justify-between gap-3"><span class="nd-quote-mark" aria-hidden="true">“</span>' +
      '<span class="mt-1 shrink-0 rounded-full border border-gold-500/50 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-gold-600">' + t.tag + "</span></div>" +
      '<blockquote class="mt-3 flex-1 text-[0.87rem] font-light leading-relaxed text-ink-700">' + t.text + "</blockquote>" +
      '<figcaption class="mt-6 border-t border-maroon-800/10 pt-4"><p class="font-display text-[1.05rem] font-semibold text-maroon-800">' + t.name + "</p>" +
      '<p class="text-xs uppercase tracking-[0.16em] text-ink-400">' + t.role + "</p></figcaption></figure>"
    );
  }
  var tTrack = document.querySelector("[data-marquee-track]");
  if (T_DATA.length && tTrack) {
    tTrack.innerHTML =
      T_DATA.map(function (t) { return '<div class="nd-marquee-item">' + tCardHTML(t) + "</div>"; }).join("") +
      T_DATA.map(function (t) { return '<div class="nd-marquee-item" aria-hidden="true">' + tCardHTML(t) + "</div>"; }).join("");
  }
  var tMore = document.querySelector("[data-feedback-more]");
  if (T_DATA.length && tMore) {
    tMore.innerHTML = T_DATA.map(function (t) {
      return '<div class="nd-fb-card">' + tCardHTML(t) + "</div>";
    }).join("");
  }

  /* ------------------ Testimonials: marquee + arrows ---------------- */
  var marquee = document.querySelector("[data-marquee]");
  if (marquee) {
    var paused = { hover: false, manual: false };
    marquee.addEventListener("mouseenter", function () { paused.hover = true; });
    marquee.addEventListener("mouseleave", function () { paused.hover = false; });
    marquee.addEventListener("focusin", function () { paused.hover = true; });
    marquee.addEventListener("focusout", function () { paused.hover = false; });

    /* Finger / mouse sweep across the cards */
    var drag = { active: false, startX: 0, startScroll: 0 };
    marquee.addEventListener("pointerdown", function (e) {
      drag.active = true;
      drag.startX = e.clientX;
      drag.startScroll = marquee.scrollLeft;
      if (marquee.setPointerCapture) marquee.setPointerCapture(e.pointerId);
      marquee.style.cursor = "grabbing";
    });
    marquee.addEventListener("pointermove", function (e) {
      if (!drag.active) return;
      marquee.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
    });
    function endDrag() {
      if (!drag.active) return;
      drag.active = false;
      marquee.style.cursor = "grab";
      var half = marquee.scrollWidth / 2;
      if (marquee.scrollLeft >= half) marquee.scrollLeft -= half;
      if (marquee.scrollLeft < 0) marquee.scrollLeft += half;
    }
    marquee.addEventListener("pointerup", endDrag);
    marquee.addEventListener("pointercancel", endDrag);
    marquee.addEventListener("pointerleave", endDrag);

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      (function drift() {
        if (!paused.hover && !paused.manual && !drag.active) {
          marquee.scrollLeft += 0.7;
          var half = marquee.scrollWidth / 2;
          if (half > 0 && marquee.scrollLeft >= half) marquee.scrollLeft -= half;
        }
        requestAnimationFrame(drift);
      })();
    }

    function nudge(dir) {
      var half = marquee.scrollWidth / 2;
      var item = marquee.querySelector(".nd-marquee-item");
      var w = item ? item.offsetWidth : 380;
      var from = marquee.scrollLeft;
      if (dir === -1 && from < w) {
        from += half;
        marquee.scrollLeft = from;
      }
      var target = from + dir * w;
      paused.manual = true;
      var t0 = performance.now();
      (function tween(now) {
        var p = Math.min((now - t0) / 520, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        marquee.scrollLeft = from + (target - from) * eased;
        if (p < 1) {
          requestAnimationFrame(tween);
        } else {
          if (marquee.scrollLeft >= half) marquee.scrollLeft -= half;
          if (marquee.scrollLeft < 0) marquee.scrollLeft += half;
          paused.manual = false;
        }
      })(t0);
    }
    var leftBtn = document.querySelector("[data-marquee-left]");
    var rightBtn = document.querySelector("[data-marquee-right]");
    if (leftBtn) leftBtn.addEventListener("click", function () { nudge(1); });
    if (rightBtn) rightBtn.addEventListener("click", function () { nudge(-1); });
  }

  /* ---------------------- View-more testimonials -------------------- */
  var moreBtn = document.querySelector("[data-feedback-toggle]");
  var feedbackMore = document.querySelector("[data-feedback-more]");
  var feedbackThanks = document.querySelector("[data-feedback-thanks]");
  if (moreBtn && feedbackMore) {
    moreBtn.addEventListener("click", function () {
      var show = feedbackMore.classList.toggle("hidden");
      if (feedbackThanks) feedbackThanks.classList.toggle("hidden", show);
      moreBtn.querySelector("[data-fb-label]").textContent = show ? "View All Feedbacks" : "View Less";
      moreBtn.setAttribute("aria-expanded", show ? "false" : "true");
      var chev = moreBtn.querySelector("[data-fb-chevron]");
      if (chev) chev.style.transform = show ? "" : "rotate(180deg)";
      if (show) {
        document.querySelector("[data-feedback-section]").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ------------------------- Training filters ----------------------- */
  var schedChips = document.querySelectorAll("[data-sched-filter]");
  if (schedChips.length) {
    schedChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        schedChips.forEach(function (c) {
          c.classList.toggle("nd-legend-chip--active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        var mode = chip.getAttribute("data-sched-filter");
        document.querySelectorAll("[data-sched-row]").forEach(function (row) {
          var show = mode === "all" || row.getAttribute("data-sched-row") === mode;
          row.style.display = show ? "" : "none";
          if (show) {
            row.classList.remove("nd-fb-card");
            void row.offsetWidth;
            row.classList.add("nd-fb-card");
          }
        });
        var count = document.querySelectorAll('[data-sched-row="' + mode + '"]').length;
        if (mode === "all") count = document.querySelectorAll("[data-sched-row]").length;
        var live = document.querySelector("[data-sched-count]");
        if (live) live.textContent = "Showing " + count + " of " + document.querySelectorAll("[data-sched-row]").length + " batches";
      });
    });
  }

  /* ============================ GALLERY ============================= */
  var galleryGrid = document.querySelector("[data-gallery-grid]");
  if (galleryGrid) {
    var OWNER_PASSCODE = "HEMA2018";
    var isOwner = sessionStorage.getItem("nda-owner") === "1";
    var filter = "all";
    var expanded = false;
    var PREVIEW = 6;
    var uploads = [];

    var filterChips = document.querySelectorAll("[data-gallery-filter]");
    var moreGallery = document.querySelector("[data-gallery-more]");
    var uploadBtns = document.querySelectorAll("[data-upload-trigger]");
    var fileInput = document.querySelector("[data-upload-input]");
    var ownerChip = document.querySelector("[data-owner-chip]");
    var ownerOnly = document.querySelectorAll("[data-owner-only]");

    function applyOwnerVisibility() {
      ownerOnly.forEach(function (el) {
        el.style.display = isOwner ? "" : "none";
      });
      if (ownerChip) ownerChip.style.display = isOwner ? "" : "none";
    }

    function items() {
      var base = Array.prototype.slice.call(galleryGrid.querySelectorAll("[data-gallery-item]"));
      return base.concat(
        uploads.map(function (u) { return u.el; })
      );
    }

    function render() {
      var all = items();
      var filtered = all.filter(function (el) {
        var kind = el.getAttribute("data-kind");
        return filter === "all" ? true : kind === filter;
      });
      filtered.forEach(function (el, i) {
        var show = expanded || i < PREVIEW;
        el.style.display = show ? "" : "none";
        if (show) {
          el.classList.remove("nd-fb-card");
          void el.offsetWidth;
          el.classList.add("nd-fb-card");
        }
      });
      all.forEach(function (el) {
        if (filtered.indexOf(el) === -1) el.style.display = "none";
      });
      if (moreGallery) {
        var hidden = filtered.length - (expanded ? filtered.length : Math.min(PREVIEW, filtered.length));
        moreGallery.style.display = hidden > 0 ? "" : "none";
        var label = moreGallery.querySelector("[data-gallery-more-label]");
        if (label) label.textContent = expanded ? "View Less" : "View More Moments (" + hidden + " more)";
      }
      var countEl = document.querySelector("[data-gallery-count]");
      if (countEl) countEl.textContent = filtered.length + " moment" + (filtered.length === 1 ? "" : "s");
    }

    filterChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        filter = chip.getAttribute("data-gallery-filter");
        expanded = false;
        filterChips.forEach(function (c) {
          c.classList.toggle("nd-filter-chip--active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        render();
      });
    });

    if (moreGallery) {
      moreGallery.addEventListener("click", function () {
        expanded = !expanded;
        render();
      });
    }

    /* ----- uploads (owner only) ----- */
    function handleFiles(list) {
      if (!list) return;
      var files = Array.prototype.slice.call(list).filter(function (f) {
        return f.type.indexOf("image/") === 0;
      });
      if (!files.length) {
        window.showToast("Only image files can join the anthology");
        return;
      }
      files.forEach(function (f) {
        var wrap = document.createElement("div");
        wrap.setAttribute("data-kind", "image");
        wrap.className = "nd-gallery-extra";
        wrap.innerHTML =
          '<button type="button" class="nd-tile" data-lightbox>' +
          '<img src="' + URL.createObjectURL(f) + '" alt="' + (f.name || "Shared moment") + '">' +
          '<span class="nd-tile-caption"><span class="nd-tile-tag">Community</span>' +
          '<span class="nd-tile-name">' + (f.name.replace(/\.[^.]+$/, "") || "Shared Moment") + "</span></span></button>";
        galleryGrid.appendChild(wrap);
        uploads.push({ el: wrap });
        bindLightbox(wrap.querySelector("[data-lightbox]"));
      });
      expanded = true;
      render();
      window.showToast(files.length + " photo" + (files.length > 1 ? "s" : "") + " added to the anthology — thank you for sharing");
    }

    uploadBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (fileInput) fileInput.click();
      });
    });
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        handleFiles(fileInput.files);
        fileInput.value = "";
      });
    }
    var dropTile = document.querySelector("[data-upload-drop]");
    if (dropTile) {
      ["dragover", "dragenter"].forEach(function (ev) {
        dropTile.addEventListener(ev, function (e) {
          e.preventDefault();
          dropTile.classList.add("nd-upload-tile--active");
        });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        dropTile.addEventListener(ev, function (e) {
          e.preventDefault();
          dropTile.classList.remove("nd-upload-tile--active");
        });
      });
      dropTile.addEventListener("drop", function (e) {
        handleFiles(e.dataTransfer.files);
      });
    }

    /* ----- owner gate: Ctrl/Cmd + Shift + O ----- */
    var ownerModal = document.querySelector("[data-owner-modal]");
    var ownerInput = document.querySelector("[data-owner-input]");
    var ownerError = document.querySelector("[data-owner-error]");
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        if (ownerModal) {
          ownerModal.style.display = "flex";
          if (ownerInput) setTimeout(function () { ownerInput.focus(); }, 60);
        }
      }
      if (e.key === "Escape") {
        if (ownerModal) ownerModal.style.display = "none";
        closeLightbox();
        closeFilm();
      }
    });
    if (ownerModal) {
      ownerModal.addEventListener("click", function (e) {
        if (e.target === ownerModal) ownerModal.style.display = "none";
      });
      var unlockForm = ownerModal.querySelector("form");
      if (unlockForm) {
        unlockForm.addEventListener("submit", function (e) {
          e.preventDefault();
          if ((ownerInput.value || "").trim().toUpperCase() === OWNER_PASSCODE) {
            sessionStorage.setItem("nda-owner", "1");
            isOwner = true;
            ownerModal.style.display = "none";
            ownerInput.value = "";
            applyOwnerVisibility();
            render();
            window.showToast("Owner mode enabled — uploads unlocked");
          } else {
            var card = ownerModal.querySelector(".nd-owner-card");
            if (card) {
              card.classList.remove("nd-shake");
              void card.offsetWidth;
              card.classList.add("nd-shake");
            }
            if (ownerError) ownerError.textContent = "Incorrect passcode — the tradition stays protected.";
            setTimeout(function () {
              if (ownerError) ownerError.textContent = "";
            }, 1800);
          }
        });
      }
      var cancelBtn = ownerModal.querySelector("[data-owner-cancel]");
      if (cancelBtn) cancelBtn.addEventListener("click", function () { ownerModal.style.display = "none"; });
    }
    var lockBtn = document.querySelector("[data-owner-lock]");
    if (lockBtn) {
      lockBtn.addEventListener("click", function () {
        sessionStorage.removeItem("nda-owner");
        isOwner = false;
        applyOwnerVisibility();
        render();
        window.showToast("Owner mode disabled — uploads hidden");
      });
    }

    /* ----- lightbox ----- */
    var lightbox = document.querySelector("[data-lightbox-modal]");
    var lbImg = lightbox ? lightbox.querySelector("img") : null;
    var lbCap = lightbox ? lightbox.querySelector("figcaption") : null;
    var lbCount = lightbox ? lightbox.querySelector("[data-lb-count]") : null;
    var lbIndex = 0;

    function lightboxImages() {
      return Array.prototype.slice.call(
        galleryGrid.querySelectorAll('[data-kind="image"] [data-lightbox]')
      ).filter(function (b) {
        var w = b.closest("[data-kind]");
        return w && w.style.display !== "none";
      });
    }
    function showLb(i) {
      var list = lightboxImages();
      if (!list.length) return;
      lbIndex = (i + list.length) % list.length;
      var img = list[lbIndex].querySelector("img");
      var name = list[lbIndex].querySelector(".nd-tile-name");
      if (lbImg) lbImg.src = img.src;
      if (lbImg) lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = name ? name.textContent : "";
      if (lbCount) lbCount.textContent = (lbIndex + 1) + " / " + list.length;
    }
    function bindLightbox(btn) {
      if (!btn || !lightbox) return;
      btn.addEventListener("click", function () {
        var list = lightboxImages();
        showLb(list.indexOf(btn));
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    }
    function closeLightbox() {
      if (lightbox && lightbox.style.display === "flex") {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
      }
    }
    if (lightbox) {
      lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (b) {
        b.addEventListener("click", closeLightbox);
      });
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      var prev = lightbox.querySelector("[data-lb-prev]");
      var next = lightbox.querySelector("[data-lb-next]");
      if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIndex - 1); });
      if (next) next.addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIndex + 1); });
      document.addEventListener("keydown", function (e) {
        if (lightbox.style.display !== "flex") return;
        if (e.key === "ArrowLeft") showLb(lbIndex - 1);
        if (e.key === "ArrowRight") showLb(lbIndex + 1);
      });
    }
    galleryGrid.querySelectorAll("[data-lightbox]").forEach(bindLightbox);

    /* ----- film modal ----- */
    var filmModal = document.querySelector("[data-film-modal]");
    var filmVideo = filmModal ? filmModal.querySelector("video") : null;
    var filmCap = filmModal ? filmModal.querySelector("[data-film-caption]") : null;
    function closeFilm() {
      if (filmModal && filmModal.style.display === "flex") {
        if (filmVideo) filmVideo.pause();
        filmModal.style.display = "none";
        document.body.style.overflow = "";
      }
    }
    document.querySelectorAll("[data-film]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!filmModal || !filmVideo) return;
        filmVideo.src = btn.getAttribute("data-film");
        filmVideo.poster = btn.querySelector("img") ? btn.querySelector("img").src : "";
        if (filmCap) filmCap.textContent = btn.getAttribute("data-film-title") || "";
        filmModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        filmVideo.play();
      });
    });
    if (filmModal) {
      filmModal.querySelectorAll("[data-film-close]").forEach(function (b) {
        b.addEventListener("click", closeFilm);
      });
      filmModal.addEventListener("click", function (e) {
        if (e.target === filmModal) closeFilm();
      });
    }

    applyOwnerVisibility();
    render();
  }

  /* ------------------------- Enroll form ---------------------------- */
  var enrollForm = document.querySelector("[data-enroll-form]");
  if (enrollForm) {
    enrollForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = enrollForm.querySelector("[data-f=name]");
      var phone = enrollForm.querySelector("[data-f=phone]");
      var email = enrollForm.querySelector("[data-f=email]");
      if (!name.value.trim() || (!phone.value.trim() && !email.value.trim())) {
        window.showToast("Please add the student's name and a phone or email so we can reply");
        return;
      }
      var success = document.querySelector("[data-enroll-success]");
      if (success) {
        var greet = success.querySelector("[data-enroll-name]");
        if (greet) greet.textContent = name.value.trim().split(" ")[0];
        var lvl = enrollForm.querySelector("[data-f=level]");
        var lvlOut = success.querySelector("[data-enroll-level]");
        if (lvlOut && lvl) lvlOut.textContent = lvl.value;
        enrollForm.style.display = "none";
        success.style.display = "flex";
      }
    });
    var againBtn = document.querySelector("[data-enroll-again]");
    if (againBtn) {
      againBtn.addEventListener("click", function () {
        enrollForm.reset();
        enrollForm.style.display = "";
        var success = document.querySelector("[data-enroll-success]");
        if (success) success.style.display = "none";
      });
    }
  }

  /* ------------------------- Footer year ---------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
