---
layout: post
title: "Data 145: Evidence and Uncertainty - Topic Map"
date: 2026-04-23
description: "A compact topic map for my Data 145 Phase 1 and Phase 2 notes."
tags: [statistics, data145, notes, statistics-inference]
categories: [technical-blogs]
featured: false
show_on_homepage: true
math: true
_styles: |
  .post h2 {
    margin-top: 3.2rem;
    padding-bottom: 0.4rem;
    border-bottom: 2px solid var(--global-theme-color);
    font-weight: 700;
  }

  .course-frame,
  .study-map {
    margin: 1.5rem 0;
    padding: 0.9rem 1.2rem;
    border-left: 3px solid var(--global-theme-color);
    border-radius: 0 8px 8px 0;
    background: var(--global-code-bg-color);
  }

  .course-frame strong,
  .study-map strong {
    color: var(--global-text-color);
  }

  .data145-hub {
    display: grid;
    gap: 0.7rem;
    margin: 1.5rem 0 2rem;
  }

  .data145-card {
    display: block;
    padding: 0.95rem 1.1rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    background: var(--global-bg-color);
    text-decoration: none;
  }

  .data145-card:hover {
    border-color: var(--global-theme-color);
    text-decoration: none;
  }

  .data145-card strong {
    display: block;
    margin-bottom: 0.3rem;
    color: var(--global-text-color);
    font-size: 1.02rem;
  }

  .data145-card span {
    color: var(--global-text-color-light);
  }

  .data145-card.featured-note {
    border-left: 3px solid var(--global-theme-color);
  }

  .data145-card .kicker {
    display: block;
    margin-bottom: 0.3rem;
    color: var(--global-text-color-light);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
---

My notes on **Data 145: Evidence and Uncertainty**. This page is a compact topic map for future review and for anyone else looking for a high-level reference.

<div class="course-frame">
  <strong>Course thread:</strong>
  how to turn noisy data into evidence, quantify uncertainty, and make decisions without pretending randomness disappeared.
</div>

## Phase 1 Notes

<div class="data145-hub">
  <a class="data145-card featured-note" href="{% post_url 2026-03-08-from-mle-to-neyman-pearson-to-reward-models %}">
    <span class="kicker">Phase 1 notes</span>
    <strong>Data 145 Phase 1: From MLE to Neyman-Pearson to Reward Models</strong>
    <span>A long-form roadmap for estimation, Fisher information, bootstrap, hypothesis testing, Neyman-Pearson, and connections to modern AI.</span>
  </a>
</div>

## Phase 2 Notes

<div class="data145-hub">
  <a class="data145-card" href="{{ '/assets/html/data145_lec14_15_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 14-15: Testing, Confidence, and Power</strong>
    <span>Testing structure, confidence intervals, and power.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec17_18_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 17-18: Likelihood and Decision Rules</strong>
    <span>Likelihood reasoning and general testing procedures.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec19_20_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 19-20: Multiple Testing</strong>
    <span>Bonferroni, FWER, FDP, and FDR.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec21_22_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 21-22: MGFs and Concentration</strong>
    <span>MGFs, Chernoff thinking, Hoeffding, and tail bounds.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec23_24_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 23-24: Geometry of Linear Models</strong>
    <span>Rotations, nuisance/signal/residual blocks, t, chi-squared, F, ANOVA, and regression.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec25_26_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lectures 25-26: Gibbs Sampling and Hierarchical Bayes</strong>
    <span>MCMC, Gibbs full conditionals, burn-in, shrinkage, empirical Bayes, and hyperparameter concentration.</span>
  </a>

  <a class="data145-card" href="{{ '/assets/html/data145_lec27_review.html' | relative_url }}">
    <span class="kicker">Phase 2 notes</span>
    <strong>Lecture 27: Introduction to Causal Inference</strong>
    <span>Potential outcomes, randomized trials, ATE estimation, confounding, propensity scores, and inverse propensity weighting.</span>
  </a>

  <a class="data145-card featured-note" href="{{ '/assets/html/data145_final_review_cheat_sheet.html' | relative_url }}">
    <span class="kicker">Final review</span>
    <strong>Compact Cheat Sheet and Test Decision Map</strong>
    <span>A course-wide final review with a complete test-selection map, compact formulas, assumptions, and common exam traps.</span>
  </a>
</div>

<div class="study-map">
  <strong>Study path:</strong>
  use Phase 1 for the pre-midterm course narrative, Phase 2 as post-midterm topic-by-topic references, and the compact cheat sheet for final-pass review.
</div>
