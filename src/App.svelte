<script lang="ts">
  import { onMount } from 'svelte'

  // ---------------------------------------------------------------
  // Mailing list. Point this at your Buttondown embed endpoint:
  //   https://buttondown.com/api/emails/embed-subscribe/YOUR-USERNAME
  // The embed endpoint doesn't send CORS headers, so the response is
  // opaque — you get no confirmation of success. If you want real
  // error handling, proxy it through a serverless function instead
  // and keep the API key server-side.
  // ---------------------------------------------------------------
  const ENDPOINT: string | null = null // e.g. 'https://buttondown.com/api/emails/embed-subscribe/debbandwinnie'

  // The paper wears one step per browsing session; after WEAR_MAX steps the copy
  // is wrecked and the "fresh copy" easter egg appears. Persisted in localStorage,
  // throttled to once-per-session via sessionStorage.
  const WEAR_MAX = 5
  const VISITS_KEY = 'daw_visits'
  const SESSION_KEY = 'daw_session'

  let sheetEl: HTMLElement

  // ---------- Decaying photocopy ----------
  // wear 0 = pristine; climbs one step per session up to WEAR_MAX (wrecked).
  let wear = $state(0)
  let resetting = $state(false)

  // ---------- Acceptance ----------
  let agree = $state(false)
  let email = $state('')
  let status = $state<'idle' | 'filing' | 'done'>('idle')
  let note = $state(
    'The Band will notify you when the Recording becomes available on the channels listed in §2.3, and otherwise sends approximately four (4) emails per year, each concerning a show or a record. A fifth is reserved for emergencies.',
  )
  let stamp = $state('Unsigned')

  const canSubmit = $derived(agree && email.indexOf('@') > 0 && status === 'idle')
  const wearNorm = $derived(wear / WEAR_MAX)
  const buttonLabel = $derived(
    status === 'done' ? 'Accepted' : status === 'filing' ? 'Filing' : 'Accept',
  )
  const locked = $derived(status !== 'idle')

  // Band name, one span per letter, with an accelerating per-letter reveal delay
  // (gaps shrink as we go, so it starts slow and speeds up toward the end).
  const letters = Array.from('Debb & Winnie').map((c, i, arr) => {
    const t = arr.length > 1 ? i / (arr.length - 1) : 0
    const delay = 0.26 + 0.52 * (1 - Math.pow(1 - t, 1.8))
    return { ch: c === ' ' ? ' ' : c, delay: delay.toFixed(3) }
  })

  onMount(() => {
    countVisit()

    // Ink the sharpie marks in as each anchor scrolls into view.
    const targets = sheetEl.querySelectorAll<HTMLElement>('[data-ink]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('inked'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('inked')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.45, rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  })

  function countVisit() {
    try {
      let visits = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) || 0
      if (!sessionStorage.getItem(SESSION_KEY)) {
        visits = Math.min(visits + 1, WEAR_MAX + 1)
        localStorage.setItem(VISITS_KEY, String(visits))
        sessionStorage.setItem(SESSION_KEY, '1')
      }
      wear = Math.min(Math.max(visits - 1, 0), WEAR_MAX)
    } catch {
      /* storage blocked (private mode / disabled) — stay pristine */
    }
  }

  function issueFreshCopy() {
    // A clean copy: keep the session guard set so it won't immediately re-age,
    // then let the grain + artifacts transition back out.
    try {
      localStorage.setItem(VISITS_KEY, '1')
    } catch {
      /* ignore */
    }
    resetting = true
    wear = 0
    window.setTimeout(() => (resetting = false), 850)
  }

  function execute() {
    note = 'Agreement executed. A copy has been filed with ' + email + '.'
    stamp = 'Executed'
    status = 'done'
  }

  function onSubmit() {
    status = 'filing'
    if (!ENDPOINT) {
      execute()
      return
    }
    const fd = new FormData()
    fd.append('email', email)
    fetch(ENDPOINT, { method: 'POST', body: fd, mode: 'no-cors' })
      .then(execute)
      .catch(() => {
        status = 'idle'
        note = 'That didn’t go through. Try again, or email press@debbandwinnie.com and we’ll add you by hand.'
      })
  }
</script>

<main class="sheet" bind:this={sheetEl} style="--wear: {wearNorm}">
  <div class="docmeta">
    <span>Rev. 1 &nbsp;·&nbsp; Brooklyn, NY</span>
    <span>Effective as of first listen</span>
  </div>

  <!-- Replacement notice — easter egg, appears only once the copy is wrecked
       (wear === WEAR_MAX). Placed up top so the reset is above the fold, and
       layered above the grain (see .errata z-index) so it stays legible. -->
  {#if wear >= WEAR_MAX}
    <div class="errata">
      <p class="lead">Notice of Illegibility</p>
      <p>
        This copy has been reproduced beyond the point of legibility. Pursuant to the Band&rsquo;s goodwill, a clean
        copy may be issued at no charge, and all prior wear is hereby waived.
      </p>
      <button class="errata-btn" onclick={issueFreshCopy}> Issue a fresh copy </button>
    </div>
  {/if}

  <!-- ================= TITLE ================= -->
  <div class="title-block anchor" data-ink>
    <h1>
      <span class="t-line">
        Terms of
        <svg class="mark m-uline" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
          <path class="draw" style="--len: 360" stroke-width="3" d="M6,9 C74,4 150,13 212,8 C252,5 282,10 295,8" />
          <path class="draw d2" style="--len: 360" stroke-width="2.2" d="M10,14 C82,10 152,16 220,12 C256,10 284,14 291,13" />
        </svg>
      </span>
      <span class="t-line">
        Service
        <svg class="mark m-uline" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
          <path class="draw d2" style="--len: 360" stroke-width="3" d="M5,8 C70,13 150,4 210,9 C250,12 280,7 296,9" />
          <path class="draw d3" style="--len: 360" stroke-width="2.2" d="M9,13 C78,16 150,9 220,14 C256,16 284,11 292,13" />
        </svg>
      </span>
    </h1>
    <div class="outnow">new single ↓ out now</div>
    <p class="subtitle">Please read carefully before listening</p>

    <div class="scrawl s-bandname" aria-label="Debb &amp; Winnie">
      {#each letters as l}
        <span class="ch" aria-hidden="true" style="transition-delay: {l.delay}s">{l.ch}</span>
      {/each}
    </div>

    <div class="scrawl red s-debbnote">
      two b’s in “Debb,”
      <br />
      not one
    </div>
    <svg class="mark red m-debbarrow" viewBox="0 0 150 82" aria-hidden="true">
      <path class="draw d2" style="--len: 240" stroke-width="2.4" d="M14,14 C42,48 94,56 134,62" />
      <path class="draw d3" style="--len: 90" stroke-width="2.4" d="M119,47 L136,63 L115,68" />
    </svg>
  </div>

  <!-- ================= PREAMBLE ================= -->
  <div class="preamble">
    <p>
      This agreement (the &ldquo;Agreement&rdquo;) is entered into by and between the Band and you, the Listener, and
      governs your access to and use of the recordings, live performances, merchandise, and general atmosphere
      described herein. <span class="redact">Nothing in this section has been reviewed by counsel and the Band would
        like that on the record.</span> By continuing to scroll, you accept these terms in full.
    </p>
  </div>

  <!-- ================= 1. DEFINITIONS ================= -->
  <h2><span class="num">1.</span> Definitions</h2>
  <p class="clause">
    <span class="ref">1.1</span> &ldquo;The Band&rdquo; means Debb and Winnie, a two&#8209;piece operating out of
    Greenpoint, Brooklyn: one on guitar, one on bass. In the event the two switch instruments, the foregoing shall be
    read in reverse.
  </p>
  <p class="clause">
    <span class="ref">1.2</span> &ldquo;The Recording&rdquo; means the single entitled <em>Terms of Service</em>, being
    the first work released under this Agreement.
  </p>
  <p class="clause anchor" data-ink>
    <span class="ref">1.3</span> &ldquo;Loud&rdquo;
    <span class="anchor" style="display: inline-block; text-indent: 0">
      means loud.
      <svg class="mark m-loud" viewBox="0 0 180 34" aria-hidden="true">
        <path class="draw" style="--len: 400" stroke-width="2.6" d="M4,24 C46,20 118,19 168,23" />
        <path class="draw d2" style="--len: 400" stroke-width="2" d="M8,29 C52,26 122,25 166,28" />
      </svg>
    </span>
    <span class="scrawl s-loud">yes</span>
  </p>

  <!-- ================= 2. LICENSE ================= -->
  <h2><span class="num">2.</span> Grant of License</h2>
  <p class="clause">
    <span class="ref">2.1</span> The Band grants the Listener a non&#8209;exclusive, worldwide, irrevocable license to
    play the Recording at any volume, in any vehicle, at any hour, without notice to the Band.
  </p>
  <p class="clause">
    <span class="ref">2.2</span> As of the date hereof, said license may be exercised through the following channel:
  </p>

  <ul class="platforms">
    <li class="anchor" data-ink>
      <a
        href="https://debbandwinnie.bandcamp.com/"
        target="_blank"
        rel="noopener noreferrer"
        data-goatcounter-click="bandcamp"
        data-goatcounter-title="Bandcamp"
      >
        <span class="idx">(a)</span>
        <span class="name">Bandcamp</span>
        <span class="go">Listen →</span>
      </a>
      <svg class="mark m-bandcamp" viewBox="0 0 620 76" preserveAspectRatio="none" aria-hidden="true">
        <path
          class="draw"
          style="--len: 1500"
          stroke-width="3"
          d="M22,40 C18,16 140,8 316,9 C492,10 602,18 600,38 C598,58 486,68 312,67 C138,66 20,58 24,36 C26,24 60,16 96,13"
        />
      </svg>
      <div class="scrawl s-bandcamp">this one actually pays us</div>
    </li>
  </ul>

  <p class="clause" style="margin-top: 26px">
    <span class="ref">2.3</span> The channels enumerated below are contemplated by this Agreement but are not yet in
    effect. They shall come into effect without further notice or amendment.
  </p>

  <ul class="platforms pending-set anchor" data-ink>
    <li class="pending">
      <span class="idx">(b)</span>
      <span class="name">Spotify</span>
      <span class="go">Pending</span>
    </li>
    <li class="pending">
      <span class="idx">(c)</span>
      <span class="name">Apple Music</span>
      <span class="go">Pending</span>
    </li>
    <li class="pending">
      <span class="idx">(d)</span>
      <span class="name">YouTube</span>
      <span class="go">Pending</span>
    </li>
    <svg class="mark m-pending" viewBox="0 0 60 150" preserveAspectRatio="none" aria-hidden="true">
      <path
        class="draw"
        style="--len: 400"
        stroke-width="2.8"
        d="M44,6 C22,8 14,14 12,40 C10,62 8,72 3,75 C9,79 11,90 12,110 C14,136 24,142 44,144"
      />
    </svg>
    <div class="scrawl s-pending">any day now</div>
  </ul>

  <!-- ================= 3. PERFORMANCES ================= -->
  <h2><span class="num">3.</span> Scheduled Performances</h2>
  <p class="clause">
    <span class="ref">3.1</span> The Band shall appear at the following times and places. Attendance is not mandatory
    but is strongly encouraged.
  </p>

  <div class="datecard anchor" data-ink>
    <div class="dc-when">
      <span class="dc-day">03</span>
      <span class="dc-mon">Oct</span>
      <span class="dc-yr">2026</span>
    </div>
    <div class="dc-where">
      <span class="dc-venue anchor">
        McCarren Parkhouse
        <svg class="mark m-date" viewBox="0 0 420 22" preserveAspectRatio="none" aria-hidden="true">
          <path class="draw" style="--len: 460" stroke-width="3" d="M6,10 C110,4 300,15 414,7" />
          <path class="draw d2" style="--len: 460" stroke-width="2.4" d="M12,17 C120,12 306,20 408,14" />
        </svg>
      </span>
      <span class="dc-city">Brooklyn, New York</span>
    </div>
  </div>
  <p class="clause" style="margin-top: 22px">
    <span class="ref">3.2</span> Further dates shall be added by amendment. Set times are estimates and the Band accepts
    no liability for the opener running long.
  </p>

  <!-- ================= 4. EXHIBIT A ================= -->
  <h2><span class="num">4.</span> Exhibit A &mdash; Photograph of the Parties</h2>
  <div class="exhibit anchor" data-ink>
    <span>This space intentionally left blank</span>
    <div class="scrawl s-photos">
      photos
      <br />
      next week
    </div>
    <svg class="mark m-photobox" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
      <path class="draw" style="--len: 340" stroke-width="2.8" d="M14,34 C70,26 210,28 288,20" />
      <path class="draw d2" style="--len: 120" stroke-width="2.6" d="M262,8 L290,20 L264,32" />
    </svg>
  </div>

  <!-- ================= 5. NOTICES ================= -->
  <h2><span class="num">5.</span> Notices</h2>
  <dl class="notices">
    <div class="anchor" data-ink>
      <dt>Booking</dt>
      <dd><a href="mailto:booking@debbandwinnie.com" data-goatcounter-click="email-booking" data-goatcounter-title="Booking email">booking@debbandwinnie.com</a></dd>
      <svg class="mark m-email" viewBox="0 0 620 46" preserveAspectRatio="none" aria-hidden="true">
        <path
          class="draw"
          style="--len: 1400"
          stroke-width="2.6"
          d="M18,10 C170,4 470,6 600,11 C606,20 604,30 598,38 C450,44 160,42 20,36 C13,28 12,18 18,10"
        />
      </svg>
    </div>
    <div>
      <dt>Press</dt>
      <dd><a href="mailto:press@debbandwinnie.com" data-goatcounter-click="email-press" data-goatcounter-title="Press email">press@debbandwinnie.com</a></dd>
    </div>
    <div>
      <dt>Everything else</dt>
      <dd><a href="https://www.instagram.com/debbandwinnie" target="_blank" rel="noopener noreferrer" data-goatcounter-click="instagram" data-goatcounter-title="Instagram">@debbandwinnie</a></dd>
    </div>
  </dl>

  <!-- ================= 6. ACCEPTANCE ================= -->
  <h2><span class="num">6.</span> Acceptance</h2>
  <div class="accept">
    <label class="accept-row">
      <input type="checkbox" bind:checked={agree} disabled={locked} />
      <span>I have read and agree to the Terms of Service.</span>
    </label>
    <div class="accept-fields">
      <input
        type="email"
        bind:value={email}
        disabled={locked}
        placeholder="you@email.com"
        autocomplete="email"
      />
      <button disabled={!canSubmit} onclick={onSubmit}>{buttonLabel}</button>
    </div>
    <p class="accept-note">{note}</p>
  </div>

  <div class="stamp">{stamp}</div>

  <p class="fineprint">
    The Band makes no warranty, express or implied, as to merchantability or fitness for a particular mood. All rights
    reserved except the ones worth having. This Agreement supersedes all prior agreements, understandings, and things
    said at load&#8209;in. Governed by the laws of the State of New York and the general customs of the venue.
  </p>

  <!-- Xerox grain: lives on the paper (absolutely positioned inside the sheet)
       so it scrolls with the content instead of feeling like a dirty screen.
       Sits above the text/marks. Additive dark-speckle noise + edge-burn — no
       mix-blend-mode (that would checkerboard on fast scroll). -->
  <div class="xerox" aria-hidden="true"></div>

  <!-- Progressive wear artifacts (streaks, edge-burn, blown-out wash). Only
       mounted once the paper has aged, so the pristine first visit pays nothing;
       `resetting` keeps it around long enough to fade out. -->
  {#if wear > 0 || resetting}
    <div class="wear-fx" aria-hidden="true"></div>
  {/if}
</main>
