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
  .course-frame {
    padding: 1rem 1.15rem;
    border: 1px solid rgba(43, 108, 176, 0.18);
    border-left: 4px solid #2b6cb0;
    border-radius: 12px;
    background: rgba(235, 244, 255, 0.72);
    margin: 1.25rem 0 1.75rem;
  }

  .course-frame strong {
    color: #1a365d;
  }

  .phase-heading {
    margin-top: 2rem;
    margin-bottom: 0.55rem;
    color: #1a365d;
  }

  .phase-note {
    color: #4a5568;
    margin-bottom: 1rem;
  }

  .data145-hub {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0 2rem;
  }

  .data145-card {
    display: block;
    padding: 1.1rem 1.2rem;
    border: 1px solid rgba(43, 108, 176, 0.18);
    border-radius: 18px;
    background: #ffffff;
    text-decoration: none;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      border-color 160ms ease;
  }

  .data145-card:hover {
    transform: translateY(-2px);
    border-color: rgba(43, 108, 176, 0.42);
    box-shadow: 0 14px 34px rgba(26, 54, 93, 0.12);
    text-decoration: none;
  }

  .data145-card strong {
    display: block;
    margin-bottom: 0.35rem;
    color: #1a365d;
    font-size: 1.05rem;
  }

  .data145-card span {
    color: #4a5568;
  }

  .data145-card.featured-note {
    background: #fffaf0;
    border-color: rgba(214, 158, 46, 0.32);
  }

  .data145-card .kicker {
    display: block;
    margin-bottom: 0.3rem;
    color: #2b6cb0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .study-map {
    padding: 1rem 1.1rem;
    border-left: 4px solid #2b6cb0;
    border-radius: 12px;
    background: rgba(235, 244, 255, 0.75);
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
</div>

<div class="study-map">
  <strong>Study path:</strong>
  use Phase 1 for the pre-midterm course narrative, then use Phase 2 as post-midterm topic-by-topic references.
</div>
