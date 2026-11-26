# Prism 每日练习 data format

Files (repo wujiyan09/ict-portal, branch main; the Prism app downloads them from raw.githubusercontent.com):
- `daily/index.json` — `{"v":1,"days":[{date,subject,title,minutes,marks,count}, ...]}`, newest first. `count` = number of questions.
- `daily/YYYY-MM-DD.json` — one paper (below).
- `daily/figs/YYYY-MM-DD-qN.png` — question figures (PNG, ≤1400 px wide, white background).

Day JSON:
```json
{
 "v": 1, "date": "2026-11-25", "subject": "ICT" | "Maths Core" | "M2" | "Physics" | "Chemistry",
 "title": "...", "scope": "...", "minutes": 30, "marks": 20,
 "scratch": true,                       // split-screen scratch paper: true for Maths Core/M2/Physics/Chemistry, false for ICT
 "keyPoints": ["**Label:** text with $inline$ LaTeX", ...],
 "examples": [{"title": "例 1（...）", "question": "...", "solution": "..."}],
 "sections": [{"title": "Section A ...", "note": "source note (optional)", "questions": [
   {"id": "2026-11-25-q1", "n": "1", "type": "mc", "marks": 1, "source": "HKDSE 2016 P1A Q5" | "原创" | "...",
    "stem": "...", "options": ["...", "...", "...", "..."],   // 4 options, no letters
    "answer": "B", "solution": "..."},
   {"id": "2026-11-25-q9", "n": "9", "type": "written", "marks": 8, "source": "...", "official": true,
    "stem": "...", "figure": "2026-11-25-q9.png",            // optional
    "parts": [{"label": "(a)", "marks": 2, "text": "...", "answer": "marking points with (1)/[1M] marks"}]},
   {"id": "...", "n": "3", "type": "written", "marks": 4, "stem": "...", "answer": "..."}   // no parts: whole-question answer
 ]}],
 "answerNote": "which answers are official marking schemes and which are derived"
}
```
Rules: sum of part marks = question marks; sum of question marks = paper marks. Text = plain text + `$...$` inline LaTeX, `$$...$$` display LaTeX on its own line, `\n` newlines, `**bold**`, Markdown pipe tables, ``` code blocks (SQL/pseudocode/Python, monospace). LaTeX must be SwiftMath-compatible (\frac, \sqrt, ^, _, \lim_{h \to 0}, \sum, \binom, \int, \Rightarrow, \text{}, \times, ^\circ). Chemistry formulas in Unicode (H₂SO₄, Cu²⁺, SO₄²⁻, →), not \ce. Never write "Quest" or "AI" anywhere; label self-written questions "原创" and non-official answers "推导答案"/"derived".
Committing: use the GitHub API (git blobs → trees with base_tree = current main tree → commits → PATCH refs/heads/main) via `app github api`; add the new day JSON, any figures, and the updated index.json in one commit. Never overwrite other files.
