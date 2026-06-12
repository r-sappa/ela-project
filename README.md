# The Power of a Story: Sri Nihal Tammana

A single page profile of **Sri Nihal Tammana** (17, founder of the non-profit
**Recycle My Battery**), built for the unit "The Power of a Story." Researched,
interviewed, and written by **Reyansh**.

Plain **HTML, CSS, and vanilla JavaScript**. No frameworks, no build step, no npm.
Just open `index.html` in any browser.

---

## Files

| File          | What it is                                                          |
|---------------|--------------------------------------------------------------------|
| `index.html`  | All seven sections of the page (the content).                      |
| `styles.css`  | All styling: colors, layout, responsiveness, animations.           |
| `script.js`   | Scroll progress, count-up stats, reveals, sticky nav, mobile menu, arrow-key navigation. |
| `favicon.svg` | The little battery icon in the browser tab.                        |
| `README.md`   | This file.                                                         |

> The folder also contains `video2429282712.mp4`, the original interview recording.
> The website does not use it, so you can delete it before deploying to keep the
> repository small.

---

## How to view it

Double-click `index.html`. It works fully offline.

---

## Presenting live

The sticky nav at the top has a link for every section, so you can jump straight to
any part while you talk. You can also use the **Left and Right arrow keys** to move to
the previous or next section hands-free (a small hint shows this when the page loads and
then fades away). Normal scrolling and text selection still work as usual.

Section order: Home, The Spark, The Problem, The Struggle, Action, The Bigger Idea,
and Closing.

---

## A note on the quotes

Every quote on the page is word-for-word from the interview transcript. The one
exception is the line about his dad in The Struggle: the transcript has Sri Nihal
recalling it rather than saying it verbatim, so it is shown as a paraphrase aside
(no quotation marks, no name attribution), never as a direct quote.

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example, `power-of-a-story`).
2. Upload the files in this folder, or push them with git:
   ```bash
   git init
   git add .
   git commit -m "Add Power of a Story site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/power-of-a-story.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings, then Pages**.
4. Under **Build and deployment, Source**, choose **Deploy from a branch**.
5. Pick branch **main** and folder **/ (root)**, then **Save**.
6. Wait about a minute. Your site goes live at:
   `https://YOUR-USERNAME.github.io/power-of-a-story/`

---

## Accessibility and quality notes

- Semantic HTML, a "Skip to content" link, and visible keyboard focus.
- Color contrast meets WCAG AA, and animations respect `prefers-reduced-motion`.
- No external requests, so the page works offline.
