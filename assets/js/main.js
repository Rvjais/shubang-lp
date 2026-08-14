/* ==========================================================================
   Dr. Shubhang Aggarwal — NHS Ortho Robotics | Landing page interactions
   ========================================================================== */
(function () {
    'use strict';

    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    /* ---------- Current year ---------- */
    var yr = $('#yr');
    if (yr) { yr.textContent = new Date().getFullYear(); }

    /* ---------- Sticky header shadow ---------- */
    var header = $('#siteHeader');
    var toTop = $('#toTop');
    function onScroll() {
        var y = window.pageYOffset;
        if (header) { header.classList.toggle('is-stuck', y > 10); }
        if (toTop) { toTop.classList.toggle('show', y > 600); }
        spyNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Mobile navigation ---------- */
    var nav = $('#mainNav');
    var navToggle = $('#navToggle');
    var backdrop = $('#navBackdrop');

    function closeNav() {
        if (!nav) { return; }
        nav.classList.remove('open');
        if (navToggle) {
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (backdrop) { backdrop.classList.remove('show'); }
        document.body.style.overflow = '';
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            navToggle.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            if (backdrop) { backdrop.classList.toggle('show', open); }
            document.body.style.overflow = open ? 'hidden' : '';
        });
    }
    if (backdrop) { backdrop.addEventListener('click', closeNav); }
    $$('#mainNav a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeNav(); closeWa(); }
    });

    /* ---------- Scroll-spy for nav ---------- */
    var navLinks = $$('#mainNav a[href^="#"]');
    var sections = navLinks
        .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
        .filter(Boolean);

    function spyNav() {
        if (!sections.length) { return; }
        var pos = window.pageYOffset + 160;
        /* stays null while the visitor is still above the first linked section */
        var current = null;
        sections.forEach(function (sec) {
            if (sec.offsetTop <= pos) { current = sec; }
        });
        navLinks.forEach(function (a) {
            a.classList.toggle('is-active', !!current && a.getAttribute('href') === '#' + current.id);
        });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = $$('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(function (el, i) {
            el.style.transitionDelay = (i % 3) * 90 + 'ms';
            io.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Animated counters ---------- */
    var counters = $$('[data-count]');
    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var plain = el.getAttribute('data-plain') === '1';
        var duration = 1600;
        var start = null;

        function step(ts) {
            if (start === null) { start = ts; }
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = Math.floor(target * eased);
            el.textContent = (plain ? String(val) : val.toLocaleString('en-IN')) + (p === 1 ? suffix : '');
            if (p < 1) { requestAnimationFrame(step); }
        }
        requestAnimationFrame(step);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window) {
            var co = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        co.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            counters.forEach(function (el) { co.observe(el); });
        } else {
            counters.forEach(runCounter);
        }
    }

    /* ---------- Lazy YouTube embeds (click to play) ---------- */
    function playVideo(card) {
        var id = card.getAttribute('data-yt');
        if (!id || card.dataset.playing) { return; }
        card.dataset.playing = '1';
        card.innerHTML =
            '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" ' +
            'title="Patient video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
            'allowfullscreen loading="lazy"></iframe>';
    }
    $$('.video-card[data-yt]').forEach(function (card) {
        card.addEventListener('click', function () { playVideo(card); });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(card); }
        });
    });

    /* ---------- FAQ accordion ---------- */
    $$('.faq-item').forEach(function (item) {
        var btn = $('.faq-q', item);
        var panel = $('.faq-a', item);
        if (!btn || !panel) { return; }
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', function () {
            var isOpen = item.classList.contains('is-open');

            $$('.faq-item.is-open').forEach(function (other) {
                other.classList.remove('is-open');
                var op = $('.faq-a', other);
                var ob = $('.faq-q', other);
                if (op) { op.style.maxHeight = null; }
                if (ob) { ob.setAttribute('aria-expanded', 'false'); }
            });

            if (!isOpen) {
                item.classList.add('is-open');
                panel.style.maxHeight = panel.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- WhatsApp chat widget ---------- */
    var waToggle = $('#waToggle');
    var waPanel = $('#waPanel');
    var waClose = $('#waClose');
    var waBadge = $('#waBadge');

    function openWa() {
        if (!waPanel) { return; }
        waPanel.classList.add('open');
        if (waToggle) { waToggle.setAttribute('aria-expanded', 'true'); }
        if (waBadge) { waBadge.style.display = 'none'; }
    }
    function closeWa() {
        if (!waPanel) { return; }
        waPanel.classList.remove('open');
        if (waToggle) { waToggle.setAttribute('aria-expanded', 'false'); }
    }

    if (waToggle && waPanel) {
        waToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (waPanel.classList.contains('open')) { closeWa(); } else { openWa(); }
        });
    }
    if (waClose) { waClose.addEventListener('click', closeWa); }
    document.addEventListener('click', function (e) {
        if (!waPanel || !waPanel.classList.contains('open')) { return; }
        if (waPanel.contains(e.target) || (waToggle && waToggle.contains(e.target))) { return; }
        closeWa();
    });

    /* Auto-invite once, after the visitor has settled in */
    var invited = false;
    function autoInvite() {
        if (invited || !waPanel) { return; }
        invited = true;
        if (window.innerWidth > 620) { openWa(); }
    }
    setTimeout(autoInvite, 12000);

    /* ---------- Appointment form → Formester ----------
       Posted to the .json endpoint with fetch so the visitor stays on this page
       instead of being redirected to app.formester.com after submitting. */
    var FORMESTER_ENDPOINT = 'https://app.formester.com/forms/IIBNeuKFc/submissions.json';

    var form = $('#apptForm');
    var success = $('#formSuccess');
    var failure = $('#formError');

    function setError(input, hasError) {
        var field = input.closest('.field');
        if (field) { field.classList.toggle('has-error', hasError); }
        return !hasError;
    }

    if (form) {
        var mobile = $('#f-mobile', form);
        if (mobile) {
            mobile.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = $('#f-name', form);
            var city = $('#f-city', form);
            var tel = $('#f-mobile', form);

            var ok = true;
            ok = setError(name, !/^[a-zA-Z\s.]{2,60}$/.test(name.value.trim())) && ok;
            ok = setError(city, city.value.trim().length < 2 || city.value.trim().length > 60) && ok;
            ok = setError(tel, !/^[6-9][0-9]{9}$/.test(tel.value.trim())) && ok;

            if (!ok) {
                var firstBad = $('.field.has-error input', form);
                if (firstBad) { firstBad.focus(); }
                return;
            }

            var payload = {
                name: name.value.trim(),
                city: city.value.trim(),
                mobile: tel.value.trim(),
                service: $('#f-service', form).value || 'General orthopaedic consultation',
                message: $('#f-msg', form).value.trim(),
                page: 'Landing page — Dr. Shubhang Aggarwal'
            };

            var submitBtn = $('button[type="submit"]', form);
            var originalLabel = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.classList.add('is-busy');
                submitBtn.textContent = 'Sending…';
            }
            if (failure) { failure.classList.remove('show'); }

            function finish(sent) {
                if (submitBtn) {
                    submitBtn.classList.remove('is-busy');
                    submitBtn.innerHTML = originalLabel;
                }
                var box = sent ? success : failure;
                if (sent && success) { success.classList.add('show'); }
                if (!sent && failure) { failure.classList.add('show'); }
                if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                if (sent) { form.reset(); }
            }

            fetch(FORMESTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (res) {
                finish(res.ok);
            }).catch(function () {
                finish(false);
            });
        });
    }

    /* ---------- Init ---------- */
    onScroll();
})();
