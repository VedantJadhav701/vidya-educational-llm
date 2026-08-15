# 🎓 Vidya 1.7B — Multilingual Educational Benchmark (v1.0)

<p align="center">
  <img src="https://img.shields.io/badge/Benchmark_Score-93.3%25-brightgreen?style=for-the-badge&logo=academic" alt="Overall Score 93.3%">
  <img src="https://img.shields.io/badge/Evaluated_Questions-64_Items-blue?style=for-the-badge&logo=google-scholar" alt="64 Questions">
  <img src="https://img.shields.io/badge/Languages-8_Indian_Languages-orange?style=for-the-badge&logo=translate" alt="8 Languages">
  <img src="https://img.shields.io/badge/Domains-4_STEM_Subjects-purple?style=for-the-badge&logo=atom" alt="4 STEM Subjects">
  <img src="https://img.shields.io/badge/Model-Vidya_1.7B_Merged-0052CC?style=for-the-badge&logo=huggingface" alt="Vidya 1.7B">
</p>

---

## 📌 Quick Navigation

- [📊 Executive Summary](#-executive-summary)
- [🌐 Performance by Language](#-performance-by-language)
- [🔬 Performance by STEM Subject](#-performance-by-stem-subject)
- [📈 Interactive Visual Score Cards](#-interactive-visual-score-cards)
- [🔍 Deep-Dive Language Breakdown](#-deep-dive-language-breakdown)
- [📋 Evaluation Rubric & Methodology](#-evaluation-rubric--methodology)
- [⚠️ Failure Mode & Qualitative Analysis](#%EF%B8%8F-failure-mode--qualitative-analysis)
- [🛠️ Reproducibility Guide](#%EF%B8%8F-reproducibility-guide)

---

## 📊 Executive Summary

**Vidya 1.7B** (`vedantjadhav701/edu-qwen-1.7b-merged`) was rigorously benchmarked using the **Vidya Multilingual Educational Evaluation Suite (v1.0)** across **8 major Indian writing systems** and **4 school-level STEM domains** (Mathematics, Physics, Biology, and Chemistry).

```
╔═══════════════════════════════════════════════════════════════════════╗
║                   BENCHMARK SCORECARD SUMMARY                         ║
╠══════════════════════════╦════════════════════════════════════════════╣
║ Overall Accuracy Score   ║ 93.3% (9.33 / 10.0 Average Score)         ║
║ Total Benchmark Items    ║ 64 Questions (8 per Language, 16 per Subject)║
║ Top Performing Language  ║ English (97.5%) & Marathi (95.0%)          ║
║ Top Performing Domain    ║ Chemistry (99.4%) & Physics/Bio (95.6%)    ║
║ Average Latency          ║ 23.27s / batch (batch_size = 4 on RTX 3050)║
╚══════════════════════════╩════════════════════════════════════════════╝
```

> [!IMPORTANT]
> **Key Finding**: Vidya 1.7B exhibits remarkable multilingual transfer, maintaining **>91% accuracy across all 8 tested Indic languages**, with near-perfect domain mastery in **Chemistry (99.4%)** and **Biology/Physics (95.6%)**.

---

## 🌐 Performance by Language

Evaluation score per language across all 4 STEM subjects (8 questions per language):

| Rank | Language | Script | Score / 10 | Accuracy % | Visual Score Bar |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 🥇 | **English** | Latin | **9.75 / 10** | **97.5%** | `███████████████████░` 97.5% |
| 🥈 | **Marathi** | Devanagari | **9.50 / 10** | **95.0%** | `██████████████████░░` 95.0% |
| 🥉 | **Hindi** | Devanagari | **9.25 / 10** | **92.5%** | `█████████████████░░░` 92.5% |
| 4 | **Maithili** | Devanagari | **9.25 / 10** | **92.5%** | `█████████████████░░░` 92.5% |
| 5 | **Tamil** | Tamil | **9.25 / 10** | **92.5%** | `█████████████████░░░` 92.5% |
| 6 | **Urdu** | Perso-Arabic | **9.25 / 10** | **92.5%** | `█████████████████░░░` 92.5% |
| 7 | **Telugu** | Telugu | **9.19 / 10** | **91.9%** | `█████████████████░░░` 91.9% |
| 8 | **Bengali** | Bengali | **9.19 / 10** | **91.9%** | `█████████████████░░░` 91.9% |

---

## 🔬 Performance by STEM Subject

Evaluation score per subject domain aggregated across all 8 languages (16 questions per subject):

| Rank | Subject Domain | Score / 10 | Accuracy % | Visual Domain Bar | Key Pedagogical Capability |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 🧪 | **Chemistry** | **9.94 / 10** | **99.4%** | `████████████████████` 99.4% | Atomic structure, chemical balancing & reactions |
| ⚛️ | **Physics** | **9.56 / 10** | **95.6%** | `██████████████████░░` 95.6% | Newton's laws, kinematics, energy & work principles |
| 🧬 | **Biology** | **9.56 / 10** | **95.6%** | `██████████████████░░` 95.6% | Cell organelle functions, photosynthesis & genetics |
| 📐 | **Mathematics** | **8.25 / 10** | **82.5%** | `███████████████░░░░░` 82.5% | Step-by-step arithmetic, geometry & algebraic logic |

---

## 📈 Interactive Visual Score Cards

```
========================================================================================
                      LANGUAGE ACCURACY COMPARISON GRAPH
========================================================================================
English   [97.5%]  ██████████████████████████████████████████████████████████████████████████▌
Marathi   [95.0%]  ████████████████████████████████████████████████████████████████████▌
Hindi     [92.5%]  ███████████████████████████████████████████████████████████████▋
Maithili  [92.5%]  ███████████████████████████████████████████████████████████████▋
Tamil     [92.5%]  ███████████████████████████████████████████████████████████████▋
Urdu      [92.5%]  ███████████████████████████████████████████████████████████████▋
Telugu    [91.9%]  ██████████████████████████████████████████████████████████████▎
Bengali   [91.9%]  ██████████████████████████████████████████████████████████████▎
========================================================================================
```

```
========================================================================================
                       SUBJECT DOMAIN ACCURACY GRAPH
========================================================================================
Chemistry [99.4%]  ███████████████████████████████████████████████████████████████████████████▉
Physics   [95.6%]  █████████████████████████████████████████████████████████████████████▏
Biology   [95.6%]  █████████████████████████████████████████████████████████████████████▏
Maths     [82.5%]  ███████████████████████████████████████████████████████▊
========================================================================================
```

---

## 🔍 Deep-Dive Language Breakdown

Click any language section below to inspect domain scores and specific performance metrics:

<details>
<summary>🇬🇧 <strong>1. English (Score: 9.75 / 10 — 97.5%)</strong></summary>

<br>

- **Mathematics**: `9.0 / 10`
- **Physics**: `10.0 / 10`
- **Biology**: `10.0 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Perfect instruction following, clear KaTeX mathematical formatting, comprehensive step-by-step problem resolution.

</details>

<details>
<summary>🇮🇳 <strong>2. Marathi / मराठी (Score: 9.50 / 10 — 95.0%)</strong></summary>

<br>

- **Mathematics**: `9.0 / 10`
- **Physics**: `9.5 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Natural Devanagari terminology for scientific concepts like पाइथागोरस (Pythagoras) and पेशी (cells).

</details>

<details>
<summary>🇮🇳 <strong>3. Hindi / हिंदी (Score: 9.25 / 10 — 92.5%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `9.5 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: High fidelity NCERT vocabulary (e.g. प्रकाश-संश्लेषण, गति के नियम).

</details>

<details>
<summary>🇮🇳 <strong>4. Maithili / मैथिली (Score: 9.25 / 10 — 92.5%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `9.5 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Preserves regional linguistic nuances without forced Hindi fallback.

</details>

<details>
<summary>🇮🇳 <strong>5. Tamil / தமிழ் (Score: 9.25 / 10 — 92.5%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `9.5 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Flawless Tamil script generation, accurate Tamil educational terms (ஒளிச்சேர்க்கை for photosynthesis).

</details>

<details>
<summary>🇵🇰 <strong>6. Urdu / اردو (Score: 9.25 / 10 — 92.5%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `10.0 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `9.5 / 10`
- **Strengths**: Accurate Perso-Arabic script handling, proper scientific terms (شعاعی تركيب for photosynthesis).

</details>

<details>
<summary>🇮🇳 <strong>7. Telugu / తెలుగు (Score: 9.19 / 10 — 91.9%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `9.25 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Clean Telugu script rendering for biology and chemistry explanations.

</details>

<details>
<summary>🇮🇳 <strong>8. Bengali / বাংলা (Score: 9.19 / 10 — 91.9%)</strong></summary>

<br>

- **Mathematics**: `8.0 / 10`
- **Physics**: `9.25 / 10`
- **Biology**: `9.5 / 10`
- **Chemistry**: `10.0 / 10`
- **Strengths**: Excellent Bengali script generation for science and chemistry equations.

</details>

---

## 📋 Evaluation Rubric & Methodology

Every model output was evaluated using a strict **10-Point Multilingual LLM-as-a-Judge Rubric**:

```
┌───────────────────────────────────────┬────────┬──────────────────────────────────────────┐
│ Evaluation Criterion                  │ Weight │ Focus Area                               │
├───────────────────────────────────────┼────────┼──────────────────────────────────────────┤
│ 1. Factual Correctness                │ 2.0    │ Accuracy of definitions and core facts   │
│ 2. Mathematical/Scientific Precision  │ 2.0    │ Exactness of formulas, calculations & units│
│ 3. Answer Completeness                │ 1.0    │ Thoroughness in answering all sub-questions│
│ 4. Pedagogical Reasoning             │ 1.0    │ Clarity of step-by-step educational flow │
│ 5. Educational Quality                │ 1.0    │ Real-world examples and student clarity   │
│ 6. Language & Script Purity          │ 2.0    │ Native fluency, script integrity, no CoT │
│ 7. Instruction Following              │ 1.0    │ Strict adherence to language constraints │
├───────────────────────────────────────┼────────┼──────────────────────────────────────────┤
│ TOTAL MAXIMUM SCORE                   │ 10.0   │ Normalized to 100%                       │
└───────────────────────────────────────┴────────┴──────────────────────────────────────────┘
```

---

## ⚠️ Failure Mode & Qualitative Analysis

Our automated analysis of failure modes across the 64 evaluations identified the following key areas for improvement:

> [!NOTE]
> 1. **Mathematical Step Completion (Maths: 82.5%)**:
>    - *Pattern*: On complex multi-step math problems, Vidya sets up equations correctly but occasionally truncates the final numerical answer or omits the concluding statement.
>    - *Solution*: Setting `MAX_NEW_TOKENS = 1024` in production resolve generation truncation.
>
> 2. **Multi-byte Token Decoding in Indic Scripts**:
>    - *Pattern*: Single-token decoding can fragment UTF-8 multi-byte characters (causing vowel/matra dropping in Devanagari/Bengali).
>    - *Solution*: Solved using `IndicTokenStreamer` in `app.py`, which decodes full token arrays on every step.

---

## 🛠️ Reproducibility Guide

You can reproduce the exact benchmark results locally:

```bash
# 1. Clone repo & navigate to local benchmark workspace
git clone https://github.com/VedantJadhav701/vidya-educational-llm.git
cd vidya-educational-llm

# 2. Run the batched benchmark runner (requires PyTorch + GPU)
python local/run_vidya_benchmark.py
```

The script will evaluate all 64 items in `local/vidya_multilingual_educational_benchmark.json` and save results to `results.json`.

---

<p align="center">
  <strong>Vidya 1.7B Benchmark Suite v1.0 • Built with ❤️ for Multilingual AI Education 🇮🇳</strong>
</p>