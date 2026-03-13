---
layout: post
title: "From MLE to Neyman-Pearson to Reward Models"
date: 2026-03-08
description: "A broad roadmap of statistical inference, inspired by Data 145, and a short bridge to modern reward-based AI."
tags: [statistics, ml, notes]
categories: [technical-blogs]
featured: false
show_on_homepage: false
math: true
_styles: |
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');

  body {
    background:
      radial-gradient(circle at top left, rgba(43, 108, 176, 0.12), transparent 34%),
      radial-gradient(circle at top right, rgba(26, 54, 93, 0.08), transparent 26%),
      linear-gradient(180deg, #f6f4ef 0%, #eef4fb 48%, #f8fbff 100%);
    color: #243142;
  }

  #navbar.navbar,
  footer.fixed-bottom {
    background: rgba(247, 244, 238, 0.92);
    backdrop-filter: blur(14px);
  }

  #navbar.navbar {
    border-bottom: 1px solid rgba(26, 54, 93, 0.12);
    box-shadow: 0 10px 30px rgba(26, 54, 93, 0.06);
  }

  #navbar .navbar-brand,
  #navbar .nav-link,
  #navbar .dropdown-item,
  #light-toggle,
  #search-toggle {
    color: #21344d !important;
  }

  #navbar .navbar-nav .nav-item.active > .nav-link,
  #navbar .navbar-nav .nav-item .nav-link:hover,
  #navbar .dropdown-item:hover,
  #light-toggle:hover,
  #search-toggle:hover {
    color: #2b6cb0 !important;
  }

  .container[role='main'] {
    width: min(1120px, calc(100vw - 2rem));
    max-width: none;
    margin-top: 3.25rem !important;
    margin-bottom: 4rem;
  }

  .post {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: none;
    margin: 0 auto 3.5rem;
    padding: clamp(2.25rem, 4vw, 4rem);
    border: 1px solid rgba(34, 68, 115, 0.11);
    border-radius: 30px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 252, 255, 0.98) 100%);
    box-shadow:
      0 28px 80px rgba(26, 54, 93, 0.12),
      0 10px 24px rgba(26, 54, 93, 0.08);
  }

  .post::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, #1a365d 0%, #2b6cb0 52%, #7aa7d8 100%);
  }

  .post-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.75rem;
    border-bottom: 1px solid rgba(43, 108, 176, 0.16);
  }

  .post-title,
  .post h1,
  .post h2,
  .post h3,
  .post h4 {
    font-family: 'Fraunces', 'Roboto Slab', Georgia, serif;
    letter-spacing: -0.02em;
    color: #18314f;
  }

  .post-title {
    max-width: 18ch;
    margin-bottom: 1rem;
    font-size: clamp(2.35rem, 4.8vw, 4rem);
    line-height: 1.02;
    text-wrap: balance;
  }

  #markdown-content {
    max-width: 104ch;
  }

  .post-meta,
  .post-tags,
  .post-tags a {
    font-family: 'IBM Plex Mono', 'SFMono-Regular', monospace;
    color: #5f7187 !important;
    font-size: 0.84rem;
    letter-spacing: 0.01em;
  }

  .post-meta {
    margin-bottom: 0.85rem !important;
    text-transform: uppercase;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding-top: 0.75rem;
    padding-bottom: 0 !important;
  }

  .post-tags a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.42rem 0.8rem;
    border: 1px solid rgba(43, 108, 176, 0.16);
    border-radius: 999px;
    background: rgba(235, 244, 255, 0.72);
    text-decoration: none;
    transition:
      transform 160ms ease,
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .post-tags a:hover {
    transform: translateY(-1px);
    background: rgba(219, 234, 254, 0.9);
    border-color: rgba(43, 108, 176, 0.28);
    text-decoration: none;
  }

  .post-content,
  .post-content p,
  .post-content li {
    font-family: 'Source Serif 4', Georgia, serif;
    color: #2b3648;
    font-size: 1.08rem;
    line-height: 1.86;
  }

  #markdown-content > p:first-of-type {
    font-size: 1.24rem;
    line-height: 1.9;
    color: #21344d;
  }

  .post-content p,
  .post-content ul,
  .post-content ol,
  .post-content blockquote,
  .post-content pre,
  .post-content .highlight {
    margin-bottom: 1.35rem;
  }

  .post h2 {
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(43, 108, 176, 0.15);
    font-size: clamp(1.7rem, 2vw, 2.05rem);
  }

  .post h3 {
    margin-top: 2rem;
    margin-bottom: 0.7rem;
    font-size: 1.34rem;
    color: #2b5c94;
  }

  .post h4 {
    margin-top: 1.6rem;
    margin-bottom: 0.45rem;
    font-size: 1.08rem;
    color: #4a617d;
  }

  .post a:not(.post-tags a) {
    color: #2b6cb0;
    text-underline-offset: 0.18em;
    text-decoration-thickness: 0.08em;
  }

  .post a:not(.post-tags a):hover {
    color: #1f4d80;
  }

  .post strong {
    color: #163559;
  }

  .post hr {
    height: 1px;
    margin: 2.5rem 0;
    border: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(43, 108, 176, 0.24) 20%, rgba(43, 108, 176, 0.24) 80%, transparent 100%);
  }

  .post ul,
  .post ol {
    padding-left: 1.3rem;
  }

  .post li {
    padding-left: 0.2rem;
    margin-bottom: 0.28rem;
  }

  .post ul li::marker {
    color: #2b6cb0;
  }

  .post ol li::marker {
    color: #1a365d;
    font-weight: 600;
  }

  .post blockquote {
    margin-left: 0;
    margin-right: 0;
    padding: 1.1rem 1.35rem;
    border-left: 4px solid #2b6cb0;
    border-radius: 0 18px 18px 0;
    background: linear-gradient(180deg, rgba(235, 244, 255, 0.9) 0%, rgba(247, 250, 252, 0.96) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .post blockquote p {
    color: #274261;
    font-size: 1.08rem;
  }

  .post code {
    font-family: 'IBM Plex Mono', 'SFMono-Regular', monospace;
    color: #1f4d80;
    background: rgba(43, 108, 176, 0.09);
    border-radius: 0.35rem;
    padding: 0.15rem 0.38rem;
  }

  .post pre,
  .post .highlight {
    overflow-x: auto;
    border: 1px solid rgba(26, 54, 93, 0.1);
    border-radius: 20px;
    background: #f7fafc;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .post pre code,
  .post .highlight code {
    background: transparent;
    padding: 0;
  }

  .post table {
    width: 100%;
    overflow: hidden;
    border-collapse: collapse;
    border: 1px solid rgba(26, 54, 93, 0.12);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
  }

  .post table th,
  .post table td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid rgba(26, 54, 93, 0.08);
  }

  .post table th {
    color: #1a365d;
    background: rgba(235, 244, 255, 0.88);
  }

  .post mjx-container[jax='CHTML'][display='true'] {
    margin: 1.6rem 0 !important;
    padding: 0.2rem 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
  }

  footer.fixed-bottom {
    border-top: 1px solid rgba(26, 54, 93, 0.08);
  }

  footer.fixed-bottom .container,
  footer.fixed-bottom a {
    color: #4f6176;
  }

  @media (max-width: 768px) {
    .container[role='main'] {
      width: auto;
      margin-top: 2.2rem !important;
      padding-left: 0.8rem;
      padding-right: 0.8rem;
    }

    .post {
      padding: 1.35rem 1rem 2rem;
      border-radius: 24px;
    }

    .post-title {
      max-width: none;
      font-size: 2.3rem;
    }

    .post-content,
    .post-content p,
    .post-content li,
    #markdown-content > p:first-of-type {
      font-size: 1.02rem;
      line-height: 1.78;
    }

    .post-tags {
      gap: 0.45rem;
    }
  }
---

This post is an attempt to explain the arc of a mathematical statistics course in a way that still feels useful **outside** the course itself.

It is inspired by the first half of Data 145, but I am rewriting it for a broader audience: someone who wants to understand how ideas like **MLE**, **Fisher information**, **bootstrap**, and **Neyman-Pearson** actually connect.

The goal is not to reproduce every proof or every computational detail from lecture. The goal is to keep the **main flow**, the **core formulas**, and the **conceptual turns** that make the subject hang together.

At the end, I also add a short bridge to **reward-based post-training in modern AI**, because some of the same ideas reappear there in a different vocabulary: KL penalties, proxy objectives, and exploitation of imperfect rewards.

---

## 1. The big picture of the course

The course has a very clean progression once the lectures are connected.

1. Start with a real statistical question.
   We want to estimate something meaningful from data, not just compute a formula in the abstract.

2. Use a model to reduce complexity.
   In Lecture 1, the Poisson process turns a hard "full distribution" problem into a one-parameter problem.

3. Estimate the parameter.
   This naturally leads to maximum likelihood estimation (MLE).

4. Ask what the estimator does across repeated samples.
   Is it consistent? Approximately normal? Efficient?

5. Build general tools for that analysis.
   This is where convergence in distribution, Slutsky, and the delta method come in.

6. Generalize from one example to a full theory of estimation.
   Statistical models, plug-in estimators, score functions, Fisher information, asymptotic normality, Cramer-Rao.

7. Then complicate the story on purpose.
   MLE is not always the best estimator under the criterion we care about. This leads to decision theory, shrinkage, admissibility, and Bayes estimators.

8. Then complicate it again.
   Priors are not directly checkable. Models may be misspecified. Variances may be hard to compute analytically. This motivates objective Bayes, robust variance ideas, and bootstrap methods.

9. Finally, shift from estimation to testing.
   First test whole distributions using KS. Then move to the formal hypothesis testing framework and Neyman-Pearson theory.

In one line, the arc goes from a **real question**, to a **model**, to an **estimator**, to its **sampling distribution**, then to **comparing estimators**, then to **Bayes / robustness / bootstrap**, then to **goodness of fit**, and finally to **hypothesis testing**.

---

## 2. What I am intentionally leaving in the background

There are a few topics I am deliberately not expanding in detail here:

- minimax calculations
- hierarchical Bayes and Gibbs sampling details
- the exact sandwich variance formula under misspecification
- randomized tests in discrete Neyman-Pearson settings

These ideas matter, but they are not the core of the story I want this post to tell.

What I do want to keep is **why** they appear:

- minimax because "best" depends on the comparison criterion
- hierarchical Bayes because priors can themselves be learned
- sandwich variance because wrong models change uncertainty calculations
- randomized tests because exact level constraints can be awkward in discrete spaces

---

## 3. Lecture 1: the motivating story

Lecture 1 is not just an intro lecture. It quietly sets up almost the whole first half of the course.

### The question

How likely is a significant earthquake in California within the next 7 days?

The key modeling step is to look at **interarrival times** between earthquakes.

### The model

The lecture argues that:

- the interarrival histogram looks right-skewed, like an exponential distribution
- the cumulative count over time is roughly linear, suggesting a roughly constant event rate

That motivates a **homogeneous Poisson process** with rate $\lambda$.

If the process is Poisson with rate $\lambda$, then the interarrival times

$$
X_1, X_2, \dots, X_n
$$

are i.i.d. exponential$(\lambda)$.

### Why this matters

This is the first big modeling lesson:

> A good parametric model can reduce an infinite-dimensional problem to a finite-dimensional one.

Instead of estimating the whole waiting-time distribution directly, we estimate a single parameter $\lambda$.

### MLE appears immediately

For i.i.d. exponential$(\lambda)$ data, the MLE is

$$
\hat\lambda_{MLE} = \frac{1}{\bar X_n}.
$$

This is already interesting because it is **not** just a sample mean. It is a **nonlinear function** of a sample mean.

### The probability we actually care about

If $X \sim \text{Exponential}(\lambda)$, then

$$
\mathbb{P}(X \le 7) = 1 - e^{-7\lambda}.
$$

So the MLE-based plug-in estimator is

$$
\hat p_{MLE} = 1 - e^{-7\hat\lambda}.
$$

The lecture also compares this to a more direct empirical estimator based on the proportion of observed waits below 7 days.

### The key lesson

Both estimators are approximately Gaussian, but the MLE-based estimator has **lower variance** if the model is right.

This is the first major payoff of parametric statistics:

> If the model is reasonable, structure can buy you efficiency.

### Why this lecture leads directly to Lecture 2

The lecture asks:

- Why is $\hat\lambda = 1/\bar X_n$ approximately normal?
- More generally, why should a smooth function of an approximately normal quantity still be approximately normal?

That is exactly the setup for the **delta method**.

### Key takeaways from Lecture 1

- Poisson process $\Rightarrow$ exponential interarrival times
- why the earthquake story motivates a parametric model
- $\hat\lambda_{MLE} = 1/\bar X_n$
- plug-in estimation of $1 - e^{-7\lambda}$
- why Lecture 1 motivates CLT + delta method rather than proving them

---

## 4. Lecture 2: convergence and the delta method

Lecture 2 is the mathematical bridge that turns Lecture 1's intuition into something usable.

### The main objects

The lecture reviews:

- convergence in distribution
- convergence in probability
- continuous mapping
- Slutsky's theorem
- delta method

### Useful facts worth keeping nearby

Lecture 2 also gives a short list of facts that are easy to forget but extremely useful later.

#### 1. Convergence in distribution does **not** imply convergence in probability in general

This is the main cautionary point.

It is possible to have

$$
X_n \xrightarrow{d} X
$$

without having

$$
X_n \xrightarrow{p} X.
$$

The lecture's standard-normal example makes this vivid: a sequence can have the right limiting **distribution** without becoming close to the limit random variable on the same sample space.

There is one especially useful special case:

> if the limit is a constant $c$, then $X_n \xrightarrow{d} c$ is equivalent to $X_n \xrightarrow{p} c$.

That fact gets used repeatedly.

#### 2. Continuous mapping theorem

If $g:\mathbb{R}\to\mathbb{R}$ is continuous, then

$$
X_n \xrightarrow{d} X
\quad \Rightarrow \quad
g(X_n) \xrightarrow{d} g(X).
$$

And the same statement is true with probability convergence:

$$
X_n \xrightarrow{p} X
\quad \Rightarrow \quad
g(X_n) \xrightarrow{p} g(X).
$$

This is one of the reasons the delta method works so cleanly: continuity lets us transfer convergence through transformations.

#### 3. Sums

If

$$
X_n \xrightarrow{p} X
\qquad \text{and} \qquad
Y_n \xrightarrow{p} Y,
$$

then

$$
X_n + Y_n \xrightarrow{p} X + Y.
$$

The lecture also stresses a subtle warning here: the analogous statement is **not** true if you replace convergence in probability with convergence in distribution.

#### 4. Slutsky's theorem

The practical version to remember is:

if

$$
X_n \xrightarrow{d} X
\qquad \text{and} \qquad
Y_n \xrightarrow{p} c,
$$

then

$$
X_n Y_n \xrightarrow{d} cX.
$$

This is the tool that lets us combine a random term with a deterministic or asymptotically deterministic term.

### A subtle point about discrete limits

The lecture also makes an important definition-level point that is easy to skip:

> convergence in distribution is defined using convergence of CDFs at the **continuity points of the limit CDF**.

That extra phrase matters when the limit distribution has jumps.

The example in the notes is:

$$
X_n =
\begin{cases}
1/n & \text{with probability } 1 - 1/n, \\
1   & \text{with probability } 1/n.
\end{cases}
$$

Intuitively, $X_n$ should converge in distribution to the constant $0$, because with high probability it is very close to $0$.

But the CDFs do **not** converge at $x=0$, because the limit CDF has a jump there. So the right definition does not require convergence at discontinuity points of the limit CDF; it only requires convergence at continuity points.

This is a small technical detail, but it is the reason convergence in distribution works for both continuous and discrete limits without forcing an unnecessarily strict definition.

### The delta method

The version to remember is:

If

$$
\sqrt{n}(Y_n - \theta) \xrightarrow{d} N(0,\sigma^2)
$$

and $g$ is differentiable with $g'(\theta) \neq 0$, then

$$
\sqrt{n}(g(Y_n) - g(\theta))
\xrightarrow{d}
N\left(0, (g'(\theta))^2 \sigma^2\right).
$$

### Why it matters

This is one of the core moves of the class:

> Once I understand the asymptotic distribution of an estimator $\hat\theta$, I also understand the asymptotic distribution of smooth functions $g(\hat\theta)$.

That matters all over the place:

- Lecture 1: $\hat\lambda = 1/\bar X_n$
- plug-in estimators in Lecture 3
- transformed parameters and probabilities later on

### Intuition

The reason it works is local linearization:

$$
g(Y_n) \approx g(\theta) + g'(\theta)(Y_n - \theta).
$$

So asymptotically, $g(Y_n)$ behaves like a constant plus a scaled version of $Y_n$.

### A useful comparison: change of variables

There is a closely related idea from density transformations that is worth keeping in mind.

If

$$
Y = g(X)
$$

and $g$ is one-to-one and differentiable, then the transformed density is

$$
f_Y(y)
=
\frac{f_X(x)}{|g'(x)|}
\quad \text{at } x=g^{-1}(y),
$$

or equivalently

$$
f_Y(y)
=
f_X(x)\left|\frac{dx}{dy}\right|.
$$

The intuition is geometric:

- if the local slope of the transformation is large, then a small interval in $x$ gets stretched into a wider interval in $y$
- the same probability mass is spread over more space, so the density in $y$ gets smaller
- if the local slope is small, the transformation compresses space and the density gets larger

This is not the delta method itself, but it is the same derivative-based intuition. In the exact density formula, the derivative rescales density under a transformation. In the delta method, the derivative rescales the local fluctuation of an estimator:

$$
\operatorname{sd}(g(Y_n)) \approx |g'(\theta)| \operatorname{sd}(Y_n).
$$

So both ideas are saying: when I transform a random quantity, the derivative tells me how uncertainty gets stretched or compressed nearby.

### Key takeaways from Lecture 2

- the difference between convergence in distribution and convergence in probability
- why $X_n \xrightarrow{d} X$ does not imply $X_n \xrightarrow{p} X$ in general
- why convergence to a constant is a special case where distribution and probability convergence line up
- what continuous mapping and Slutsky let me do
- how sums behave under convergence in probability
- why the general definition of convergence in distribution uses continuity points of the limit CDF
- the exact statement of the delta method
- how to use the delta method to move from $\hat\theta$ to $g(\hat\theta)$
- how derivatives rescale uncertainty, both in change-of-variables formulas and in the delta method

---

## 5. Lecture 3: models, estimators, likelihood

Lecture 3 zooms out. Instead of focusing on one earthquake example, it builds the general language of statistics.

### Probability vs. statistics

The course keeps emphasizing this switch:

- **probability:** distribution known, study random outcomes
- **statistics:** data observed, distribution unknown, infer structure

That shift in perspective drives everything else.

### Parametric vs. nonparametric

A **parametric model** assumes the data come from a family

$$
f_\theta, \quad \theta \in \Theta,
$$

where $\theta$ is finite-dimensional.

A **nonparametric model** does not assume a fixed finite-dimensional form.

This distinction becomes important again later:

- parametric MLE theory
- nonparametric bootstrap
- KS testing of full distributions

### Estimators, consistency, asymptotic normality

Lecture 3 sets up the three recurring estimator questions:

1. Is the estimator close to the truth for large $n$?
2. What is its approximate sampling distribution?
3. What happens if I transform it?

That leads to:

- consistency
- asymptotic normality
- plug-in estimators
- delta method for transformed estimators

### Plug-in estimation

If I care about $g(\theta)$, the natural estimator is

$$
g(\hat\theta).
$$

This is simple but conceptually huge. A lot of the course can be summarized as:

1. analyze $\hat\theta$
2. transfer that result to $g(\hat\theta)$

### Likelihood and why MLE makes sense

For i.i.d. data, the likelihood is

$$
\text{Lik}(\theta;X) = \prod_{i=1}^n f_\theta(X_i),
$$

and the log-likelihood is

$$
\ell_n(\theta;X) = \sum_{i=1}^n \log f_\theta(X_i).
$$

For one observation, I will write

$$
\ell_1(\theta;X) = \log f_\theta(X).
$$

So for i.i.d. data,

$$
\ell_n(\theta;X_1,\dots,X_n) = \sum_{i=1}^n \ell_1(\theta;X_i).
$$

The MLE is the $\theta$ that maximizes this.

### Consistency of the MLE

The lecture's main idea is:

- by the law of large numbers,

$$
\frac{1}{n}\ell_n(\theta) \approx \mathbb{E}_{\theta_0}[\log f_\theta(X)]
$$

- the expected log-likelihood is maximized at the true parameter $\theta_0$
- so the empirical maximizer should be near the true maximizer for large $n$

This gives the heuristic for MLE consistency.

### Why the truth maximizes the expected log-likelihood

Lecture 3 makes that second bullet precise by defining

$$
M(\theta) = \mathbb{E}_{\theta_0}[\log f_\theta(X)].
$$

The key claim is that

$$
M(\theta) \le M(\theta_0)
$$

for every $\theta$, with equality only when the model at $\theta$ is the same as the true model.

The proof is a clean Jensen argument. Write

$$
M(\theta) - M(\theta_0)
=
\mathbb{E}_{\theta_0}\left[
\log\frac{f_\theta(X)}{f_{\theta_0}(X)}
\right].
$$

Since $\log$ is concave, Jensen gives

$$
\mathbb{E}_{\theta_0}\left[
\log\frac{f_\theta(X)}{f_{\theta_0}(X)}
\right]
\le
\log
\mathbb{E}_{\theta_0}\left[
\frac{f_\theta(X)}{f_{\theta_0}(X)}
\right].
$$

But that expectation is

$$
\mathbb{E}_{\theta_0}\left[
\frac{f_\theta(X)}{f_{\theta_0}(X)}
\right]
=
\int \frac{f_\theta(x)}{f_{\theta_0}(x)} f_{\theta_0}(x)\,dx
=
\int f_\theta(x)\,dx
= 1.
$$

So

$$
M(\theta) - M(\theta_0) \le \log 1 = 0.
$$

This is one of the most useful ideas in the course: on average, the truth fits best inside the model class.

There is one caveat from the lecture worth remembering: this is still only a heuristic for consistency, because the law of large numbers gives pointwise convergence of $\ell_n(\theta)/n$ to $M(\theta)$, while proving consistency of the maximizer requires stronger uniform control.

### Score function

The score is the derivative of the log-likelihood:

$$
S_n(\theta) = \ell_n'(\theta).
$$

At the true parameter, its expectation is zero:

$$
\mathbb{E}_{\theta_0}[S_n(\theta_0)] = 0.
$$

This makes the score look like a centered random fluctuation around the truth, which is exactly why it later enters asymptotic normality.

### Fisher information

For one observation,

$$
I(\theta)
=
\operatorname{Var}_\theta(\ell_1'(\theta;X))
=
\mathbb{E}_\theta[(\ell_1'(\theta;X))^2]
=
-\mathbb{E}_\theta[\ell_1''(\theta;X)].
$$

This is the one-sample Fisher information.

For $n$ i.i.d. observations, the full-sample information is

$$
I_n(\theta)
=
\operatorname{Var}_\theta(\ell_n'(\theta))
=
-\mathbb{E}_\theta[\ell_n''(\theta)]
=
nI(\theta).
$$

So here:

- $I(\theta)$ is the information from one observation
- $I_n(\theta)=nI(\theta)$ is the information from the whole sample

This identity is central.

Interpretation:

- large information means the likelihood is sharply curved around its maximum
- sharp curvature means the parameter is estimated more precisely

The last form,

$$
I(\theta) = -\mathbb{E}_\theta[\ell_1''(\theta;X)],
$$

is easiest to remember if I think in terms of curvature. Near a maximum, a log-likelihood curve bends downward, so its second derivative is typically negative. Taking a minus sign turns that downward curvature into a positive measure of how sharp the peak is.

So the intuition is:

- if $\ell_1''(\theta;X)$ is very negative on average, the log-likelihood is steeply curved and the parameter is easier to pin down
- if $\ell_1''(\theta;X)$ is close to zero on average, the log-likelihood is flatter and many nearby parameter values look similar

That is why the negative expected second derivative shows up as "information": it measures how strongly the data distinguishes nearby parameter values.

### Key takeaways from Lecture 3

- what a statistical model is
- parametric vs. nonparametric
- what plug-in estimation is
- why MLE consistency comes from expected log-likelihood
- how Jensen's inequality shows that $M(\theta)$ is maximized at the truth
- score function and why its mean is zero
- Fisher information and its three equivalent forms

---

## 6. Lectures 4 and 5: asymptotic normality and efficiency of the MLE

This is where the course formalizes what it had been previewing since Lecture 1.

### The main theorem

Under regularity conditions,

$$
\sqrt{n}(\hat\theta_{MLE} - \theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right).
$$

Equivalently, for large $n$,

$$
\hat\theta_{MLE}
\approx
N\left(\theta_0,\frac{1}{nI(\theta_0)}\right).
$$

This is one of the most important formulas in the course.

### How the derivation works

The logic is worth remembering even if I do not re-prove every step:

1. The MLE solves the score equation

$$
S_n(\hat\theta) = 0.
$$

2. Taylor expand around the truth:

$$
0 \approx S_n(\theta_0) + (\hat\theta - \theta_0)S_n'(\tilde\theta)
$$

for some intermediate $\tilde\theta$.

3. Rearranging gives

$$
\hat\theta - \theta_0
\approx
-\frac{S_n(\theta_0)}{S_n'(\tilde\theta)}.
$$

4. The numerator is a sum of mean-zero i.i.d. terms, so the CLT applies.

5. The denominator behaves like $-nI(\theta_0)$ by the law of large numbers and regularity.

6. Slutsky then gives the asymptotic normal limit.

This is the deepest connection in the first half of the course:

> CLT + Taylor expansion + Fisher information = asymptotic distribution of the MLE.

### Approximate inference from the theorem

For large $n$, the standard error of the MLE is approximately

$$
\operatorname{SE}(\hat\theta_{MLE})
\approx
\sqrt{\frac{1}{nI(\theta_0)}}.
$$

Since $\theta_0$ is unknown, we usually plug in $\hat\theta$:

$$
\operatorname{SE}(\hat\theta_{MLE})
\approx
\sqrt{\frac{1}{nI(\hat\theta)}}.
$$

This is the frequentist route to approximate confidence intervals.

### Efficiency and Cramer-Rao

Lecture 5 then asks a natural question:

> Even if the MLE is good, could some other estimator have smaller variance?

The benchmark result is the Cramer-Rao lower bound:

$$
\operatorname{Var}_\theta(T) \ge \frac{1}{nI(\theta)}
$$

for unbiased estimators $T$.

So if an unbiased estimator reaches this bound, it is efficient.

### The nuance I do not want to forget

This part is easy to overstate.

- The Cramer-Rao bound is a statement about **unbiased** estimators.
- The MLE is **asymptotically efficient** under regularity.
- That does **not** mean every finite-sample MLE is literally unbiased and best in every possible sense.
- An MLE can be biased in finite samples.
- An MLE is not automatically admissible; admissibility is always relative to a specified loss, and it depends on whether some other estimator dominates it.

Lecture 6 exists precisely because this stronger statement is false.

### Key takeaways from Lectures 4-5

- the asymptotic normality formula for the MLE
- the logic of the proof through the score Taylor expansion
- why Fisher information determines asymptotic variance
- the Cramer-Rao bound
- the meaning of "efficient" and "asymptotically efficient"

---

## 7. Lecture 6: decision theory, shrinkage, admissibility

Lecture 6 is the course's first deliberate correction to the idea that "MLE is always the answer."

### The central message

MLE is excellent in many settings, but:

> the "best" estimator depends on the loss function and the criterion used to compare estimators.

### Loss and risk

This lecture introduces:

- **loss** $L(\theta,a)$: how bad action $a$ is when the truth is $\theta$
- **risk** $R(\theta;T)$: expected loss of estimator $T$

Under squared error loss,

$$
R(\theta;T) = \mathbb{E}_\theta[(T-\theta)^2] = \operatorname{MSE}_\theta(T).
$$

And the bias-variance decomposition says

$$
\operatorname{MSE} = \operatorname{Var} + \text{Bias}^2.
$$

More explicitly, if

$$
\mu = \mathbb{E}_\theta[T],
$$

then

$$
\mathbb{E}_\theta[(T-\theta)^2]
=
\mathbb{E}_\theta[(T-\mu)^2]
+
(\mu-\theta)^2.
$$

The cross term disappears because $\mathbb{E}_\theta[T-\mu]=0$. This is the basic reason a biased estimator can still win under MSE: a small increase in bias can be worth it if the variance drops enough.

### The coin flip example

For $X \sim \text{Binomial}(n,p)$:

- MLE: $\hat p = X/n$
- Laplace shrinkage estimators:

$$
\tilde p_1 = \frac{X+1}{n+2}, \qquad
\tilde p_2 = \frac{X+2}{n+4}
$$

These shrink toward $1/2$.

### Why shrinkage can help

The MLE is unbiased, but the Laplace estimators deliberately add bias.

Why would that ever help?

Because reducing variance can be worth more than the bias cost, especially when the true $p$ is near $1/2$.

This is the bias-variance tradeoff in a clean, concrete form.

### The bootstrap point-estimator caution

Lecture 6 also studies a very specific "bootstrap estimator":

- resample many bootstrap datasets
- compute the MLE each time
- average those bootstrap MLEs

This is **not** the same as bootstrap confidence intervals in Lecture 10.

The point of Lecture 6 is:

> averaging bootstrap point estimates does not improve the original estimator.

In the Bernoulli example, the bootstrap estimator has:

- the same bias as the MLE
- **higher** variance
- therefore strictly higher MSE

So it is inadmissible.

### Admissibility

Lecture 6 then sharpens the comparison language.

An estimator $T_1$ is **inadmissible** if there exists another estimator $T_2$ such that

$$
R(\theta;T_2) \le R(\theta;T_1)
\qquad \text{for all } \theta \in \Theta,
$$

and

$$
R(\theta;T_2) < R(\theta;T_1)
\qquad \text{for at least one } \theta.
$$

In that case, $T_2$ **dominates** $T_1$. An estimator that is not inadmissible is called **admissible**.

For the four estimators in this lecture:

- the bootstrap estimator is inadmissible, because the MLE has the same bias and strictly smaller variance, so its MSE is lower everywhere
- the MLE, Laplace +1/+1, and Laplace +2/+2 are all admissible within this comparison, because their risk curves cross and none dominates the others everywhere

This is an important conceptual point: admissibility is only a **minimal** requirement. It tells me when an estimator is definitely unacceptable, but it does not by itself tell me which admissible estimator I should prefer.

### How do we choose among admissible estimators?

The lecture gives two ways:

1. restrict to a class, such as unbiased estimators
2. summarize the full risk curve by a single target

Examples of the second idea:

- average risk
- worst-case risk

For the broader story of the course, the **average-risk / Bayes** direction is the one to remember most.

### Bayes estimator appears naturally

This is where the lecture makes a subtle but important shift in what is random.

In the ordinary bias-variance decomposition, $\theta$ is fixed and the randomness comes from the estimator $T(X)$ through the sample.

In the Bayes step, I condition on the observed data $X$. Once I do that, $T(X)$ is just a number, while $p$ becomes the random quantity because I am averaging over the **posterior distribution** of $p \mid X$.

So for a fixed observed dataset,

$$
\mathbb{E}[(T(X)-p)^2 \mid X]
=
\operatorname{Var}(p \mid X)
+
(\mathbb{E}[p \mid X] - T(X))^2.
$$

This is the same algebra as bias-variance, but with the roles changed: now the target $p$ is the random variable and the estimator value $T(X)$ is fixed.

The first term does not depend on $T$, so the posterior expected squared error is minimized when

$$
T^*(X) = \mathbb{E}[p \mid X].
$$

This is the Bayes estimator under squared error loss.

In the uniform-prior case, this gives

$$
T^*(X) = \frac{X+1}{n+2},
$$

which is exactly Laplace +1/+1. With a Beta$(2,2)$ prior, the same logic gives Laplace +2/+2.

So Bayesian estimation does not just appear philosophically in Lecture 7. It already appears in Lecture 6 as the optimizer of an average-risk decision problem.

### Key takeaways from Lecture 6

- loss, risk, MSE, bias-variance decomposition
- why unbiased is not the same as best under MSE
- why shrinkage can beat the MLE in some regions
- why the bootstrap point estimator is worse
- admissibility, dominance, and which estimators are admissible in the coin-flip example
- Bayes estimator under squared error is posterior mean

### What I leave in the background from Lecture 6

- worst-case risk / minimax calculations

---

## 8. Lecture 7: Bayesian inference proper

Lecture 7 turns the decision-theory motivation into full Bayesian inference.

### The basic identity

The posterior is

$$
\pi(\theta \mid x) \propto f_\theta(x)\pi(\theta).
$$

That is:

$$
\text{posterior} \propto \text{likelihood} \times \text{prior}.
$$

A distinction worth keeping straight:

- MLE maximizes the likelihood; in smooth interior problems, a common way to find it is to differentiate the log-likelihood and set the derivative equal to zero
- MAP maximizes the posterior; in smooth interior problems, a common way to find it is to differentiate the log-posterior and set the derivative equal to zero

So the mechanics look similar, but MAP includes the prior term while MLE does not.

### Conjugate families

The lecture focuses on three standard families:

- **Beta-Binomial**
- **Gamma-Exponential**
- **Normal-Normal**

These are worth remembering because they show the same pattern over and over:

1. choose a prior from a convenient family
2. multiply by the likelihood
3. posterior stays in the same family
4. posterior mean becomes a weighted average of prior information and data

#### Beta-Binomial

Setup:

$$
p \sim \text{Beta}(\alpha,\beta),
\qquad
X \mid p \sim \text{Binomial}(n,p),
$$

Posterior:

$$
p \mid X \sim \text{Beta}(X+\alpha, n-X+\beta).
$$

If I want the posterior mode, then for a Beta$(a,b)$ distribution with $a>1$ and $b>1$,

$$
\operatorname{mode}=\frac{a-1}{a+b-2}.
$$

So in the Beta-Binomial posterior,

$$
\hat p_{MAP}
=
\frac{X+\alpha-1}{n+\alpha+\beta-2},
$$

provided $X+\alpha>1$ and $n-X+\beta>1$.

#### Gamma-Exponential

Setup:

$$
X_1,\dots,X_n \overset{iid}{\sim} \mathrm{Exp}(\lambda),
\qquad
\lambda \sim \mathrm{Gamma}(\alpha,\beta),
$$

where I am using the shape-rate parameterization, the prior density is

$$
\pi(\lambda) \propto \lambda^{\alpha-1}e^{-\beta\lambda}.
$$

Likelihood:

$$
f_\lambda(x_1,\dots,x_n)
=
\lambda^n e^{-\lambda \sum_{i=1}^n x_i}.
$$

Posterior:

$$
\pi(\lambda \mid x)
\propto
f_\lambda(x)\pi(\lambda)
\propto
\lambda^{n+\alpha-1}e^{-(\beta+\sum x_i)\lambda},
$$

which is a Gamma density again:

$$
\lambda \mid X_1,\dots,X_n
\sim
\mathrm{Gamma}\left(n+\alpha,\; \beta+\sum_{i=1}^n X_i\right).
$$

So Gamma is conjugate to the Exponential likelihood, just as Beta is conjugate to the Binomial likelihood.

#### Normal-Normal

Setup:

$$
X_1,\dots,X_n \overset{iid}{\sim} N(\theta,\sigma^2),
\qquad
\theta \sim N(\mu_0,\tau_0^2),
$$

with $\sigma^2$ known.

Likelihood:

$$
f_\theta(x_1,\dots,x_n)
\propto_\theta
\exp\left(-\frac{n(\bar X-\theta)^2}{2\sigma^2}\right).
$$

So the data enter only through $\bar X$.

Posterior:

$$
\theta \mid X_1,\dots,X_n \sim N(\mu_1,\tau_1^2),
$$

where the cleanest form is in terms of precision:

$$
\frac{1}{\tau_1^2}
=
\frac{n}{\sigma^2}+\frac{1}{\tau_0^2}.
$$

And the posterior mean is

$$
\mu_1
=
\frac{n/\sigma^2}{n/\sigma^2+1/\tau_0^2}\bar X
+
\frac{1/\tau_0^2}{n/\sigma^2+1/\tau_0^2}\mu_0.
$$

So the Normal prior is conjugate to the Normal likelihood, and the posterior mean is again a weighted average of the MLE $\bar X$ and the prior mean $\mu_0$.

### Posterior mean as weighted average

This is one of the main conceptual takeaways.

The posterior mean combines:

- what the prior says
- what the data say

This formalizes the shrinkage intuition from Lecture 6.

Bayes under squared error does not imply unbiasedness.

#### Beta-Binomial mean

For Beta-Binomial, this can be written explicitly as

$$
\mathbb{E}[p \mid X]
=
\frac{X+\alpha}{n+\alpha+\beta}
=
w \, \hat p_{MLE} + (1-w)\frac{\alpha}{\alpha+\beta},
$$

where

$$
w=\frac{n}{n+\alpha+\beta}.
$$

So the posterior mean is a weighted average of the MLE and the prior mean, with $\alpha+\beta$ playing the role of a prior sample size.

#### Gamma-Exponential mean

For Gamma-Exponential, the posterior mean is

$$
\mathbb{E}[\lambda \mid X]
=
\frac{n+\alpha}{\beta+\sum_{i=1}^n X_i}
=
\frac{n+\alpha}{\beta+n\bar X}.
$$

Since the MLE is

$$
\hat\lambda_{MLE}=\frac{1}{\bar X},
$$

I can rewrite the posterior mean as

$$
\mathbb{E}[\lambda \mid X]
=
w\,\hat\lambda_{MLE} + (1-w)\frac{\alpha}{\beta},
$$

with

$$
w=\frac{n\bar X}{\beta+n\bar X}.
$$

So again the posterior mean sits between the MLE and the prior mean.

#### Normal-Normal mean

For Normal-Normal, the posterior mean is

$$
\mu_1
=
w\,\bar X + (1-w)\mu_0,
$$

where

$$
w=\frac{n/\sigma^2}{n/\sigma^2+1/\tau_0^2}.
$$

So the weight goes toward the data when the sample is large or the noise variance $\sigma^2$ is small, and it goes toward the prior when the prior variance $\tau_0^2$ is small.

This is the part I would remember:

- Beta-Binomial: posterior mean is between $\hat p$ and the prior mean for $p$
- Gamma-Exponential: posterior mean is between $\hat\lambda$ and the prior mean $\alpha/\beta$
- Normal-Normal: posterior mean is between $\bar X$ and the prior mean $\mu_0$
- in all three cases, as $n$ grows, the weight on the MLE goes to $1$

For the exponential model there is also a nice pseudodata interpretation: $\alpha$ behaves like a prior number of events and $\beta$ behaves like prior total exposure time, so the prior mean rate is $\alpha/\beta$.

### "The likelihood is all that matters"

More precisely:

> once the prior is fixed, the data enter the posterior only through the likelihood

and often only through a sufficient statistic.

This is why likelihood-based summaries remain central even in Bayesian inference.

### Large-sample behavior: the prior washes out

Lecture 7 also gives the key asymptotic message:

for large $n$, the posterior is approximately normal around the MLE:

$$
\pi(\theta \mid X)
\approx
N\left(\hat\theta_{MLE}, \frac{1}{nI(\hat\theta_{MLE})}\right).
$$

This is the Bernstein-von Mises phenomenon, stated informally in lecture.

So for large samples:

- Bayesian credible intervals
- frequentist asymptotic confidence intervals

become very close.

### Key takeaways from Lecture 7

- posterior proportional to likelihood times prior
- conjugate priors in the three main examples
- posterior mean as the Bayes estimator under squared error
- likelihood as the key data summary
- prior washes out for large $n$
- why Bayesian and frequentist intervals start to agree asymptotically

---

## 9. Lecture 8: where priors come from

Lecture 8 is less about calculation and more about interpretation and prior choice.

### The warning

Unlike the likelihood model, the prior is typically **uncheckable** from data.

That is a serious point, not just a philosophical aside.

If the prior is strong and the sample size is not large, the prior can materially affect the conclusion.

### Four ways priors arise in the lecture

1. **Subjective Bayes**

   - prior as personal degree of belief

2. **Objective Bayes**

   - flat priors
   - Jeffreys prior

3. **Convenience priors**

   - often conjugate priors chosen for tractability

4. **Hierarchical Bayes**
   - use data from related groups to learn prior structure

For the conceptual arc of this post, the first three matter more than the last.

### Jeffreys prior

The headline formula is

$$
\pi_J(\theta) \propto \sqrt{I(\theta)}.
$$

Why it matters:

- a flat prior is not invariant under reparameterization
- Jeffreys prior is designed to fix that problem

So when I change coordinates, Jeffreys behaves in a principled way whereas a naive "uniform prior" may not.

### Key takeaways from Lecture 8

- priors are uncheckable
- flat priors are not automatically neutral
- Jeffreys prior is based on $\sqrt{I(\theta)}$
- the distinction between subjective, objective, and convenience priors

### What I leave in the background from Lecture 8

- hierarchical Bayes details
- Gibbs sampler details

---

## 10. Lecture 9: what if the model is wrong?

This lecture is conceptually important because it fixes a hidden assumption in all the earlier MLE theory.

### The hidden assumption

Earlier lectures assumed the model family $f_\theta$ actually contains the truth.

Lecture 9 asks:

> what if the true distribution is $g$, and $g$ is not in the model family?

### KL divergence

The key object is

$$
D_{KL}(g \,\|\, f_\theta)
=
\mathbb{E}_g\left[\log \frac{g(X)}{f_\theta(X)}\right].
$$

### The main message

When the model is misspecified, the MLE does not converge to a "true parameter" inside the family, because there may not be one.

Instead, it converges to the pseudo-true value

$$
\theta^* = \arg\min_\theta D_{KL}(g \,\|\, f_\theta).
$$

So the MLE is still doing something meaningful:

> it picks the member of the wrong family that is closest to the truth in KL divergence.

### Why the usual variance formula breaks

If the model is wrong, then the old Fisher-information variance formula no longer automatically applies.

That is why the lecture introduces the **sandwich** idea:

- the center still comes from a Taylor expansion around the pseudo-true value
- but the variance now uses quantities under the true distribution $g$, not just the parametric model

I do not need the exact formula here, but I do want to remember:

> misspecification changes the asymptotic variance, so a robust correction is needed.

### Key takeaways from Lecture 9

- what misspecification means
- what KL divergence measures
- why the misspecified MLE targets the KL projection $\theta^*$
- why the old MLE variance formula may fail under misspecification
- why a sandwich-style correction is introduced

---

## 11. Lecture 10: bootstrap for uncertainty

Lecture 10 returns to the bootstrap, but now in the correct role: **estimating uncertainty**, not improving a point estimator.

### Why bootstrap shows up here

Earlier lectures often had clean formulas for the MLE, the Fisher information, and the approximate variance.

Lecture 10 asks what to do when that breaks:

- the MLE may not have a closed form
- the Fisher information may be hard to calculate
- the statistic $T=T(X_1,\dots,X_n)$ may be complicated even if the model itself is simple

The bootstrap is the workaround: approximate the sampling distribution of $T$ by resampling, then use that approximation for standard errors and confidence intervals.

### Parametric bootstrap

Use this when I trust a parametric family.

Suppose

$$
X_1,\dots,X_n \overset{iid}{\sim} f_\theta
$$

and I want to estimate $\theta$, but finding the standard error of $\hat\theta$ analytically is hard.

The lecture's parametric-bootstrap recipe is:

1. fit the model and get $\hat\theta$
2. for each of $B$ repetitions, simulate

   $$
   X_1^{\ast},\dots,X_n^{\ast} \overset{iid}{\sim} f_{\hat\theta}
   $$

3. compute the bootstrap estimate $\hat\theta^{\ast}$ from that simulated sample
4. estimate the standard error of $\hat\theta$ by the empirical standard deviation of the $B$ bootstrap values $\hat\theta^{\ast}$

Why this is useful:

- it keeps the parametric structure of the model
- it helps when analytic variance calculations are hard
- it is natural when my whole analysis already depends on the fitted model

The tradeoff is built into the setup: this method is only as good as the parametric model I am willing to simulate from.

### A unifying point about confidence intervals

Once I have a collection of bootstrap replicates, the same confidence-interval constructions can be used in either setting:

- parametric bootstrap: the replicates come from the fitted model $f_{\hat\theta}$
- nonparametric bootstrap: the replicates come from the empirical distribution $F_n$

So the normal, percentile, and basic/bootstrap intervals below are not tied to only one version of the bootstrap. The main difference is where the bootstrap samples come from.

### Nonparametric bootstrap

Use this when I do **not** want to assume a parametric family.

Here the underlying cdf is just some unknown $F$, and I replace it by the empirical cdf

$$
F_n(x)=\frac{1}{n}\sum_{i=1}^n I(X_i\le x).
$$

Then I treat $F_n$ as a stand-in for the population distribution and resample from it.

The lecture's procedure is:

1. start with i.i.d. data $X_1,\dots,X_n$
2. resample $X_1^{\ast},\dots,X_n^{\ast}$ i.i.d. from $F_n$
3. compute $T(X_1^{\ast},\dots,X_n^{\ast})$
4. repeat this $B$ times
5. use the empirical distribution of those $B$ bootstrap statistics as an approximation to the sampling distribution of $T$

Why this is useful:

- it avoids committing to a parametric family
- it is often practical when $T$ is too complicated for analytic variance calculations
- it turns the sample itself into a data-driven approximation of the population

The lecture's caution is that this is an approximation justified when $n$ and $B$ are large. So it is powerful, but not magic.

### Three confidence interval methods in the lecture

For a concrete 95% template, let:

- $\hat\theta$ be the original estimate
- $\widehat{se}_{boot}$ be the bootstrap standard error

Write the bootstrap estimate quantiles as

$$
q^{\ast}_{0.025}, \; q^{\ast}_{0.975},
$$

where these are the 2.5th and 97.5th percentiles of the bootstrap estimates $\hat\theta^{\ast}$.

Write the bootstrap error as

$$
\varepsilon^{\ast} = \hat\theta^{\ast} - \hat\theta,
$$

and write the bootstrap error quantiles as

$$
\varepsilon^{\ast}_{0.025}, \; \varepsilon^{\ast}_{0.975}.
$$

That is the same information you would otherwise write abstractly with $\alpha = 0.05$ and $\alpha/2 = 0.025$, but the 95% notation is often easier to read quickly.

#### 1. Normal interval

Estimate the bootstrap standard error and use

$$
\hat\theta \pm z_{0.975}\widehat{se}_{boot}.
$$

This is the most familiar-looking interval.

Best case:

- the estimator is approximately normal
- the estimator is roughly centered at the parameter

Pros:

- simple
- easy to explain
- close to the usual asymptotic normal interval from MLE theory

Cons:

- if the bootstrap distribution is skewed, this can be misleading
- if the estimator is not centered well, the coverage can be poor

So the lecture does not say "never use it," but it does say the justification depends on approximate normality and centering.

For a 95% interval, this is the familiar

$$
\hat\theta \pm 1.96\,\widehat{se}_{boot}.
$$

#### 2. Percentile interval

Take the lower and upper quantiles of the bootstrap distribution of the estimator itself. If

$$
\hat\theta^{\ast}_{0.025}
\qquad \text{and} \qquad
\hat\theta^{\ast}_{0.975}
$$

are the bootstrap quantiles, the interval is

$$
(\hat\theta^{\ast}_{0.025},\hat\theta^{\ast}_{0.975})
=
(q^{\ast}_{0.025},q^{\ast}_{0.975}).
$$

The lecture says this works well when the distribution of the estimator is roughly symmetric and centered at the parameter. If it is also roughly normal, this essentially matches the normal interval.

Pros from the lecture:

- simple
- equal-tail intervals transform nicely under any monotone function of the parameter

Cons from the lecture:

- can behave badly if the estimator is biased
- the theoretical justification is shaky unless the estimator is roughly unbiased and roughly normal

So for a 95% interval, the percentile method is just:

$$
(q^{\ast}_{0.025},q^{\ast}_{0.975}).
$$

#### 3. Basic / empirical bootstrap interval

This uses the bootstrap distribution of the **error**

$$
\delta = \hat\theta - \theta
$$

rather than the distribution of $\hat\theta$ directly.

The logic is:

if $\delta_{0.025}$ and $\delta_{0.975}$ are quantiles of the error distribution, then

$$
1-\alpha
=
P(\delta_{0.025}<\hat\theta-\theta<\delta_{0.975}),
$$

so the confidence interval becomes

$$
(\hat\theta-\delta_{0.975},\hat\theta-\delta_{0.025}).
$$

Of course I do not know the true error $\delta$, so the bootstrap replaces it with

$$
\delta^{\ast} = \hat\theta^{\ast}-\hat\theta.
$$

If

$$
\delta^{\ast}_{0.025}
\qquad \text{and} \qquad
\delta^{\ast}_{0.975}
$$

are the bootstrap quantiles, then the empirical/basic interval is

$$
(\hat\theta-\delta^{\ast}_{0.975},\hat\theta-\delta^{\ast}_{0.025}).
$$

Equivalently, because

$$
\delta^{\ast}=\hat\theta^{\ast}-\hat\theta,
$$

the endpoints can be written as

$$
(2\hat\theta-\hat\theta^{\ast}_{0.975},\;2\hat\theta-\hat\theta^{\ast}_{0.025})
=
(\hat\theta-\varepsilon^{\ast}_{0.975},\;\hat\theta-\varepsilon^{\ast}_{0.025}).
$$

The main conceptual point:

- percentile interval works directly with bootstrap estimates
- basic bootstrap recenters around the original estimate and has better bias behavior

So the basic interval is the recentered version of the percentile interval, written either with bootstrap estimate quantiles or with bootstrap error quantiles.

Why the lecture likes this method more:

- it actually uses the original estimate $\hat\theta$
- it has stronger theoretical justification than the percentile method
- it can reduce the bias problem, because the difference $\hat\theta^{\ast}-\hat\theta$ cancels a shared bias term

The lecture's intuition is: if $\hat\theta$ tends to overestimate $\theta$ by some amount $b$, then $\hat\theta^{\ast}$ tends to overestimate $\hat\theta$ by roughly the same amount, so subtracting $\hat\theta$ from $\hat\theta^{\ast}$ helps remove that second layer of bias.

One more useful comparison from the notes:

- if the bootstrap distribution of $\hat\theta^{\ast}$ is roughly symmetric about $\hat\theta$, the percentile and basic intervals are roughly the same
- if that distribution is also roughly normal and centered, then all three methods are roughly the same

### The main lesson

Lecture 10 complements Lecture 6 perfectly:

- Lecture 6: bootstrap averaging does **not** improve point estimation
- Lecture 10: bootstrap is very useful for approximating **sampling distributions, standard errors, and confidence intervals**

### What I would remember in practice

- parametric bootstrap: use when the model is trusted, but formulas are hard
- nonparametric bootstrap: use when I want to avoid a parametric model and let the empirical distribution stand in for the population
- normal interval: simplest, but depends most strongly on approximate normality and centering
- percentile interval: simple and transformation-friendly, but can amplify bias
- basic bootstrap interval: more careful about bias and usually the safest of the three bootstrap intervals discussed here

### Key takeaways from Lecture 10

- parametric vs. nonparametric bootstrap
- when each is appropriate
- normal vs. percentile vs. basic bootstrap intervals
- the main pros and cons of the three interval methods

---

## 12. Lecture 11: empirical CDF and KS tests

This lecture shifts attention from estimating parameters to checking entire distributions.

### The empirical CDF

For data $X_1,\dots,X_n$, the empirical CDF is

$$
F_n(x) = \frac{1}{n}\sum_{i=1}^n I(X_i \le x).
$$

It is the natural nonparametric summary of the sample distribution.

### KS statistic

For testing whether the data come from a fully specified continuous CDF $F$,

$$
D_n = \sup_x |F_n(x) - F(x)|.
$$

This is the Kolmogorov-Smirnov statistic.

Interpretation:

> it measures the largest vertical gap between the empirical CDF and the hypothesized CDF.

### Why KS is nice

Under a fully specified continuous null, the null distribution of $D_n$ is **distribution-free**.

That is a major fact. The lecture shows this by transforming through the null CDF to Uniform$(0,1)$.

So under the null, the problem effectively reduces to

$$
\sup_{0 \le u \le 1} |G_n(u) - u|
$$

for an empirical CDF $G_n$ of uniforms.

### Unknown-parameter case

If the null is not fully specified, for example

$$
H_0: F_X = F_\theta
$$

with unknown $\theta$, then the old distribution-free KS null no longer applies.

The lecture's fix is:

1. estimate $\theta$ by $\hat\theta$
2. compute the KS distance from $F_{\hat\theta}$
3. estimate the null distribution by **parametric bootstrap**

This is a beautiful connection back to Lecture 10.

### Two-sample KS

If I have two independent samples with empirical CDFs $F_n$ and $G_m$, then

$$
D_{n,m} = \sup_x |F_n(x) - G_m(x)|
$$

tests whether the two samples come from the same continuous distribution.

Unlike the one-sample case, there is no fixed null CDF sitting on the right-hand side. Both $F_n$ and $G_m$ are random empirical CDFs, so the convenient one-sample rewrite to Uniform$(0,1)$ versus $u$ is not the main formula to remember here. For two-sample KS, the clean object is the original

$$
\sup_x |F_n(x) - G_m(x)|.
$$

### Key takeaways from Lecture 11

- definition of the empirical CDF
- definition and interpretation of the KS statistic
- why the fully specified continuous-null case is distribution-free
- why the unknown-parameter case is different
- why parametric bootstrap is used there
- the two-sample KS setup

---

## 13. Lectures 12 and 13: hypothesis testing and Neyman-Pearson

These lectures shift from "estimate the unknown" to "decide whether to reject a null hypothesis."

### Core testing language

I want to be fluent with:

- null and alternative hypotheses
- type I error
- type II error
- level $\alpha$
- power

The power function is the probability of rejection as a function of the parameter.

### The main problem setup

Lecture 12 emphasizes that hypothesis testing problems vary a lot:

- one-sample $z$-test
- $t$-test with nuisance parameter
- Fisher exact test
- permutation test

But before tackling all of those, the course solves the cleanest case first:

> simple null vs. simple alternative

### Likelihood ratio test

If the null and alternative have densities $f_0$ and $f_1$, define

$$
\operatorname{LR}(X) = \frac{f_1(X)}{f_0(X)}.
$$

The likelihood ratio test rejects for large LR.

### Neyman-Pearson lemma

This is one of the major theorems to know.

It says:

> among all level-$\alpha$ tests for a simple null versus a simple alternative, the likelihood ratio test has the greatest power.

The lecture gives the intuition as "bang for buck":

- bang = power gained under $H_1$
- buck = type I error spent under $H_0$
- ratio = $f_1/f_0$

So we should spend our rejection budget on sample points with the largest likelihood ratio.

That is a very memorable way to think about the theorem.

### Why the Benford example matters

Lecture 12 compares TV, KS, and the LRT in a Benford-vs-Uniform example.

The lesson is:

- if the alternative is specifically known, the LRT is best by NP
- omnibus tests like TV or KS are useful when the alternative is not fully specified

So the "best test" depends on how much structure I am willing to assume.

### A handy likelihood-ratio simplification trick

When I only care about the rejection region, I usually do not need the raw likelihood ratio in its original form. A faster route is:

- take logs, because $\log$ is strictly increasing
- simplify the log-likelihood ratio by dropping additive terms that do not depend on the data
- if useful, exponentiate again, because $\exp$ is also strictly increasing

So "reject for large LR" is equivalent to "reject for large log LR," and more generally equivalent to rejecting for any strictly increasing transformation of the LR.

This is especially handy in one-parameter exponential families. If the likelihood ratio has the form

$$
\operatorname{LR}(x)
=
C(\theta_0,\theta_1)\exp\{a(\theta_0,\theta_1)T(x)\},
$$

then for fixed $\theta_1>\theta_0$, deciding whether LR is large is the same as deciding whether $T(x)$ is large whenever $a(\theta_0,\theta_1)>0$.

That is often the quickest way to see why the optimal rejection rule becomes a threshold rule in a sufficient statistic.

### Lecture 13: beyond simple vs. simple

Lecture 13 generalizes the picture.

#### UMP tests

For one-sided alternatives in families with **monotone likelihood ratio (MLR)**, there can be a uniformly most powerful (UMP) test.

That means one test beats all competitors at every parameter value in the alternative.

This is the clean case where optimality extends beyond simple-vs-simple.

More precisely, a family has MLR in a statistic $T(X)$ if for every $\theta_1 < \theta_2$,

$$
\frac{f_{\theta_2}(x)}{f_{\theta_1}(x)}
$$

is nondecreasing in $T(x)$.

The intuition is:

- larger values of $T(X)$ are stronger evidence for larger values of $\theta$
- as $\theta$ increases, the whole model shifts in a way that pushes $T(X)$ upward

### Why MLR gives a UMP test

This is the logical bridge I want to remember.

Fix some $\theta_1 > \theta_0$. By the Neyman-Pearson lemma, the most powerful level-$\alpha$ test for

$$
H_0:\theta=\theta_0
\qquad \text{vs} \qquad
H_1:\theta=\theta_1
$$

rejects for large

$$
\frac{f_{\theta_1}(x)}{f_{\theta_0}(x)}.
$$

If the family has MLR in $T(X)$, then this likelihood ratio is increasing in $T(X)$. So the NP-optimal test rejects for large $T(X)$.

The crucial point is that the rejection region

$$
\{T(X)\ge c\}
$$

does not depend on which particular $\theta_1 > \theta_0$ I chose; it only depends on the direction "larger than $\theta_0$." So the same test is NP-optimal against every simple alternative $\theta_1 > \theta_0$ at once. That is exactly why it is UMP for

$$
H_0:\theta\le \theta_0
\qquad \text{vs} \qquad
H_1:\theta>\theta_0.
$$

There is one extra step for the composite null. The lecture explains that in an MLR family, the power of the test "reject for large $T(X)$" is increasing in $\theta$. So the largest Type I error inside the null happens at the boundary $\theta=\theta_0$. If I choose $c$ so the test has level $\alpha$ at $\theta_0$, then it automatically has level at most $\alpha$ for every $\theta\le\theta_0$.

### The $\bar X$ example

For

$$
X_1,\dots,X_n \overset{iid}{\sim} N(\mu,\sigma^2)
$$

with known $\sigma^2$, the lecture says the family has MLR in $\bar X$.

So when testing

$$
H_0:\mu\le \mu_0
\qquad \text{vs} \qquad
H_1:\mu>\mu_0,
$$

the UMP test rejects for large $\bar X$.

Why? For any fixed $\mu_1>\mu_0$, the likelihood ratio simplifies to something increasing in $\bar X$, so NP says the best test against that $\mu_1$ rejects for large $\bar X$. Since this is true for every $\mu_1>\mu_0$, the same rejection rule works uniformly over the whole one-sided alternative.

This is the clean mental picture:

- Poisson family: MLR in $X$, so reject for large $X$
- normal mean with known variance: MLR in $\bar X$, so reject for large $\bar X$
- more generally: one-parameter exponential families tend to have MLR in their sufficient statistic

So when you were remembering "LR is increasing on $\bar X$ or something," that is exactly the right idea. The increase in LR as a function of $\bar X$ is what turns the NP lemma for each fixed alternative into a single UMP test for the whole one-sided family of alternatives.

#### Two-sided alternatives

For two-sided alternatives, there is generally **no UMP test**.

That is a major conceptual point:

> alternatives in opposite directions create conflicting notions of power, so no single test can be best everywhere.

#### Nuisance parameters and the $t$-test

Lecture 13 also explains why the $t$-test works:

- the variance is unknown
- that variance is a nuisance parameter
- the test statistic is constructed so its null distribution no longer depends on the nuisance parameter

This is the pivotal-quantity idea.

### Key takeaways from Lectures 12-13

- type I error, type II error, level, power
- likelihood ratio test and its interpretation
- statement and intuition of the Neyman-Pearson lemma
- why LRT is optimal for simple-vs-simple
- what UMP means
- why MLR matters for one-sided alternatives
- why two-sided alternatives usually do not have a UMP test
- why the $t$-test is a nuisance-parameter solution

### What I leave in the background from Lectures 12-13

- randomized-test details

---

## 14. The most important connections between lectures

This is the section I most want to remember when the lectures start to blur together.

### Connection 1: Lecture 1 to Lecture 2

Lecture 1 gives a nonlinear estimator:

$$
\hat\lambda = \frac{1}{\bar X_n}.
$$

Lecture 2 explains why that still has an asymptotically normal distribution:

- first CLT for $\bar X_n$
- then delta method for $1/x$

### Connection 2: Lecture 2 to Lecture 3

Lecture 2 gives the generic tool:

- analyze $Y_n$
- then analyze $g(Y_n)$

Lecture 3 turns that into a statistical principle:

- analyze $\hat\theta$
- then use plug-in estimation for $g(\hat\theta)$

### Connection 3: Lecture 3 to Lectures 4-5

Lecture 3 defines:

- score
- Fisher information
- MLE consistency

Lectures 4-5 use exactly those objects to derive

$$
\sqrt{n}(\hat\theta - \theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right).
$$

### Connection 4: Lectures 5 to 6

After proving that MLE is asymptotically efficient, the course immediately asks:

> efficient according to which criterion?

That opens the door to loss functions, MSE, shrinkage, and admissibility.

### Connection 5: Lecture 6 to Lectures 7-8

Lecture 6 shows that minimizing average risk leads to posterior means.

Lecture 7 says: good, now let us do Bayes properly.

Lecture 8 then asks the next unavoidable question:

> where should the prior come from?

### Connection 6: Lecture 8 to Lecture 9

Lecture 8 worries that the prior is uncheckable.
Lecture 9 worries that the **model itself** may be wrong.

So the course shifts from:

- "what if the prior is questionable?"

to:

- "what if the likelihood family is questionable?"

### Connection 7: Lecture 9 to Lecture 10

Lecture 9 says analytic variance calculations may fail or become messy under misspecification.

Lecture 10 answers:

> if formulas are hard, approximate the sampling distribution by bootstrap.

### Connection 8: Lecture 10 to Lecture 11

Lecture 10 develops the empirical distribution and resampling.

Lecture 11 uses the empirical CDF itself as the main object in goodness-of-fit testing.

### Connection 9: Lecture 11 to Lectures 12-13

Lecture 11 is still about testing, but for whole distributions.

Lectures 12-13 move to the broader and more formal testing framework:

- rejection regions
- type I / type II error
- power
- optimal tests

So the course ends the first half by unifying goodness-of-fit ideas with general decision-theoretic testing language.

---

## 15. A compact checklist of formulas and ideas

If I had to compress the whole story into one compact page of formulas and claims, this is what I would keep.

### Key conceptual distinctions

These are the points that are easiest to blur together when reading the broader story, but they are exactly the distinctions that make the subject hang together.

- **Regular versus nonregular MLE behavior**:
  the standard asymptotic normality theorem is a regular-model theorem. In nonregular problems, such as the German tank setup where the support depends on the parameter, the MLE can converge at rate $n$ rather than $\sqrt{n}$ and can have a nonnormal limit.

- **Finite-sample efficiency versus asymptotic efficiency**:
  Cramer-Rao is a finite-sample bound for unbiased estimators, while MLE efficiency is usually an asymptotic statement. Those are not the same claim.

- **MLE does not mean unbiased or admissible**:
  an MLE can be biased in finite samples, and it is not guaranteed to be admissible. Admissibility is a separate decision-theoretic question defined relative to a chosen loss.

- **Bayes estimators depend on the loss**:
  posterior mean is Bayes under squared error, posterior median under absolute loss, and posterior mode under $0$-$1$ loss.

- **ETI versus HPDI**:
  not every credible interval is the same. Equal-tail intervals and highest-posterior-density intervals coincide in symmetric cases, but not in general.

- **Pseudo-true parameter under misspecification**:
  when the model is wrong, the MLE does not converge to the truth. It converges to the KL-closest approximation inside the model family.

- **Why sandwich variance appears**:
  under misspecification, curvature and score variability no longer match the way they do under correct specification, so the usual standard-error formula has to be corrected.

- **The three KS settings**:
  one-sample KS with fully specified continuous null is distribution-free; one-sample KS with estimated parameters is not; two-sample KS compares two empirical CDFs directly.

- **MLR is the bridge from NP to UMP**:
  Neyman-Pearson gives the best test for each fixed simple alternative. Monotone likelihood ratio is what makes the same threshold statistic work for an entire one-sided alternative.

- **The Cauchy example is a warning sign**:
  "reject for large sample mean" is not a universal testing rule. Heavy-tailed models can break the clean normal-family intuition.

- **P-values under a continuous null**:
  under a continuous null hypothesis, a valid p-value is Uniform$(0,1)$. That is why rejecting when $p \le \alpha$ gives a level-$\alpha$ test.

### Core formulas

#### Asymptotics and delta method

$$
\sqrt{n}(\bar X_n - \mu) \xrightarrow{d} N(0,\sigma^2)
$$

$$
\sqrt{n}(Y_n - \theta) \xrightarrow{d} N(0,\sigma^2)
\Rightarrow
\sqrt{n}(g(Y_n)-g(\theta)) \xrightarrow{d} N(0,(g'(\theta))^2\sigma^2)
$$

Useful reminders:

- When a proof or derivation has one part converging in distribution and another part converging in probability to a constant, that is a Slutsky setup. Group them that way before simplifying.
- A common pattern is

  $$
  \frac{\sqrt{n}(\bar X_n-\mu)}{\hat\sigma}
  =
  \left(\frac{\sqrt{n}(\bar X_n-\mu)}{\sigma}\right)
  \left(\frac{\sigma}{\hat\sigma}\right),
  $$

  where the first factor has a limiting distribution and the second factor converges to $1$. Slutsky then combines them.

- In the delta method, the derivative is evaluated at the original target parameter. If $g(\lambda)=1/\lambda$, then

  $$
  g'(\lambda)=-\frac{1}{\lambda^2},
  $$

  and the asymptotic variance uses this derivative evaluated at the true $\lambda$.

#### Likelihood, score, information, and MLE

$$
\ell_1(\theta;X)=\log f_\theta(X)
$$

$$
\ell_n(\theta) = \sum_{i=1}^n \log f_\theta(X_i)
$$

$$
S_n(\theta) = \ell_n'(\theta)
$$

$$
S_n(\theta)=\sum_{i=1}^n S_1(\theta;X_i)
\qquad
\text{where } S_1(\theta;X)=\ell_1'(\theta;X)
$$

$$
I(\theta)
=
\operatorname{Var}(\ell_1'(\theta;X))
=
\mathbb{E}[(\ell_1'(\theta;X))^2]
=
-\mathbb{E}[\ell_1''(\theta;X)]
$$

$$
I_n(\theta)=nI(\theta)
\qquad
\text{for i.i.d. data}
$$

$$
S_n'(\theta)=\sum_{i=1}^n S_1'(\theta;X_i)
$$

$$
\sqrt{n}(\hat\theta_{MLE}-\theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right)
$$

$$
\operatorname{Var}(T) \ge \frac{1}{nI(\theta)}
\quad
\text{for unbiased } T
$$

Useful reminders:

- For i.i.d. data, the $n$-sample log-likelihood, score, and observed curvature are all sums of their one-sample versions. That is why it is often easiest to compute the one-observation form first and then sum over $i$.
- If an unbiased estimator reaches the Cramer-Rao bound

  $$
  \operatorname{Var}(T)=\frac{1}{nI(\theta)},
  $$

  then it is efficient. This is the standard way to show an estimator has the best possible variance among unbiased estimators.

- Separate that from the asymptotic statement: MLE is typically asymptotically efficient, not automatically finite-sample efficient.

$$
\operatorname{MSE} = \operatorname{Var} + \text{Bias}^2
$$

#### High-yield model formulas

Bernoulli:

$$
\hat p_{MLE} = \bar X_n,
\qquad
\operatorname{Var}(\bar X_n)=\frac{p(1-p)}{n}
$$

$$
\operatorname{logit}(p)=\log\frac{p}{1-p},
\qquad
\frac{d}{dp}\operatorname{logit}(p)=\frac{1}{p(1-p)}
$$

$$
\operatorname{Var}(\operatorname{logit}(\hat p)) \approx \frac{1}{n\,p(1-p)}
$$

Poisson:

$$
\hat\lambda_{MLE} = \bar X_n,
\qquad
I(\lambda)=\frac{1}{\lambda}
$$

Exponential with rate $\lambda$:

$$
\hat\lambda_{MLE} = \frac{1}{\bar X_n},
\qquad
I(\lambda)=\frac{1}{\lambda^2},
\qquad
\operatorname{Var}(\hat\lambda_{MLE}) \approx \frac{\lambda^2}{n}
$$

$$
\mathbb{P}(X \le 7) = 1 - e^{-7\lambda}
$$

Exponential with mean $\mu$:

$$
\hat\mu_{MLE} = \bar X_n,
\qquad
I(\mu)=\frac{1}{\mu^2},
\qquad
\operatorname{Var}(\hat\mu_{MLE}) \approx \frac{\mu^2}{n}
$$

Pareto with known lower cutoff $x_m$:

$$
\hat\alpha_{MLE} = \frac{n}{\sum_{i=1}^n \log(X_i/x_m)}
$$

#### Bayes and decision theory

$$
\pi(\theta \mid x) \propto f_\theta(x)\pi(\theta)
$$

$$
\pi_J(\theta) \propto \sqrt{I(\theta)}
$$

Under common losses:

- squared error $\Rightarrow$ Bayes estimator is posterior mean
- absolute loss $\Rightarrow$ Bayes estimator is posterior median
- $0$-$1$ loss $\Rightarrow$ Bayes estimator is posterior mode

Bayes optimality $\ne$ unbiasedness.

Estimator rules worth distinguishing:

- MLE: maximize the likelihood; in smooth interior problems, differentiate the log-likelihood
- MAP: maximize the posterior; in smooth interior problems, differentiate the log-posterior

Conjugate update patterns worth remembering:

$$
p \sim \mathrm{Beta}(\alpha,\beta),
\quad
X \mid p \sim \mathrm{Binomial}(n,p)
\quad \Rightarrow \quad
p \mid X=x \sim \mathrm{Beta}(x+\alpha,\; n-x+\beta)
$$

So in the Beta-Binomial model, $\alpha$ behaves like prior successes and $\beta$ behaves like prior failures. The posterior literally updates by adding observed counts: successes become $x+\alpha$ and failures become $n-x+\beta$.

The prior and posterior means are

$$
\mathbb{E}[p] = \frac{\alpha}{\alpha+\beta},
\qquad
\mathbb{E}[p \mid X=x] = \frac{x+\alpha}{n+\alpha+\beta}.
$$

For Beta$(a,b)$ with $a>1$ and $b>1$, the mode is

$$
\frac{a-1}{a+b-2}.
$$

So the Beta-Binomial posterior mode, hence the MAP estimator, is

$$
\hat p_{MAP}
=
\frac{x+\alpha-1}{n+\alpha+\beta-2},
$$

when $x+\alpha>1$ and $n-x+\beta>1$.

So the posterior mean is a weighted average of the sample proportion and the prior mean:

$$
\mathbb{E}[p \mid X=x]
=
\frac{n}{n+\alpha+\beta}\frac{x}{n}
+
\frac{\alpha+\beta}{n+\alpha+\beta}\frac{\alpha}{\alpha+\beta}.
$$

$$
\lambda \sim \mathrm{Gamma}(\alpha,\beta),
\quad
X_1,\dots,X_n \overset{iid}{\sim} \mathrm{Exp}(\lambda)
\quad \Rightarrow \quad
\lambda \mid X \sim \mathrm{Gamma}\left(n+\alpha,\; \beta+\sum_{i=1}^n X_i\right)
$$

#### Misspecification, bootstrap, and KS

$$
D_{KL}(g \,\|\, f_\theta)
=
\mathbb{E}_g\left[\log\frac{g(X)}{f_\theta(X)}\right]
$$

$$
\theta^* = \arg\min_\theta D_{KL}(g \,\|\, f_\theta)
$$

$$
F_n(x)=\frac{1}{n}\sum_{i=1}^n I(X_i \le x)
$$

$$
D_n = \sup_x |F_n(x)-F(x)|
$$

$$
D_{n,m} = \sup_x |F_n(x)-G_m(x)|
$$

Bootstrap interval templates:

- 95% percentile interval uses the bootstrap estimate quantiles:

  $$
  (q^{\ast}_{0.025}, q^{\ast}_{0.975})
  $$

- 95% basic / pivotal interval uses the bootstrap error quantiles:

  $$
  (\hat\theta-\varepsilon^{\ast}_{0.975}, \hat\theta-\varepsilon^{\ast}_{0.025})
  =
  (2\hat\theta-q^{\ast}_{0.975}, 2\hat\theta-q^{\ast}_{0.025})
  $$

- 95% normal: $\hat\theta \pm 1.96\,\widehat{se}_{boot}$

#### Hypothesis testing

$$
\operatorname{LR}(X)=\frac{f_1(X)}{f_0(X)}
$$

Under a continuous null:

$$
p \sim \mathrm{Uniform}(0,1)
$$

and the rejection rule is

$$
\text{reject } H_0 \text{ when } p \le \alpha.
$$

### Distribution relationships worth remembering

These are the kinds of structural facts that make derivations feel less random.

- Exponential is Gamma with shape 1:
  in the rate parameterization,

  $$
  \mathrm{Exp}(\lambda) = \mathrm{Gamma}(1,\lambda).
  $$

- Bernoulli to Binomial:
  if $X_1,\dots,X_n \overset{iid}{\sim} \mathrm{Bernoulli}(p)$, then

  $$
  \sum_{i=1}^n X_i \sim \mathrm{Binomial}(n,p).
  $$

- Exponential to Gamma:
  if $X_1,\dots,X_k \overset{iid}{\sim} \mathrm{Exponential}(\lambda)$, then

  $$
  \sum_{i=1}^k X_i \sim \mathrm{Gamma}(k,\lambda)
  $$

  in the rate parameterization. So Gamma is the waiting-time distribution for several Poisson-process arrivals, while Exponential is the waiting time for the first arrival.

  A scaling rule that is useful right away is: if

  $$
  Y \sim \mathrm{Gamma}(\alpha,\beta),
  $$

  then for any $c>0$,

  $$
  cY \sim \mathrm{Gamma}\left(\alpha,\frac{\beta}{c}\right)
  $$

  in the rate parameterization.

  So if

  $$
  S_n=\sum_{i=1}^n X_i \sim \mathrm{Gamma}(n,\lambda),
  $$

  then

  $$
  \bar X_n=\frac{S_n}{n}\sim \mathrm{Gamma}(n,n\lambda).
  $$

  This is a quick way to track the variance:

  $$
  \operatorname{Var}(S_n)=\frac{n}{\lambda^2},
  \qquad
  \operatorname{Var}(\bar X_n)=\frac{1}{n^2}\operatorname{Var}(S_n)=\frac{1}{n\lambda^2}.
  $$

  A notation reminder that helps in these computations: once I know the distribution of the variable I care about, I should integrate against the density of that variable and use a dummy symbol on the right-hand side. In general, if $Y$ has density $f_Y$, then

  $$
  \mathbb{E}[h(Y)] = \int h(y)f_Y(y)\,dy.
  $$

  So if I want

  $$
  \mathbb{E}\left[\frac{1}{\bar X_n}\right],
  $$

  and I know the density of $\bar X_n$, then I write

  $$
  \mathbb{E}\left[\frac{1}{\bar X_n}\right]
  =
  \int_0^\infty \frac{1}{x} f_{\bar X_n}(x)\,dx.
  $$

  The point is that $x$ is just the integration variable. Inside the integral, I plug the dummy value $x$ into the function, so it becomes $1/x$, not $1/\bar X_n$.

- Gamma plus Gamma stays Gamma:
  if independent gamma variables have the same rate parameter, their sum is again gamma, with shape parameters adding.

- Poisson plus Poisson stays Poisson:
  if $X \sim \mathrm{Poisson}(\lambda_1)$ and $Y \sim \mathrm{Poisson}(\lambda_2)$ are independent, then

  $$
  X+Y \sim \mathrm{Poisson}(\lambda_1+\lambda_2).
  $$

- Normal plus Normal stays Normal:
  sums and averages of independent normal random variables are still normal. This is why the normal model is so algebraically convenient.

- Chi-square is a special Gamma:
  if $Z_1,\dots,Z_k \overset{iid}{\sim} N(0,1)$, then

  $$
  \sum_{i=1}^k Z_i^2 \sim \chi_k^2,
  $$

  and $\chi_k^2$ is the same as a Gamma distribution with shape $k/2$.

- Probability integral transform:
  if $X$ has a continuous CDF $F$, then

  $$
  U = F(X) \sim \mathrm{Uniform}(0,1).
  $$

  This is the key CDF relationship behind two important course ideas:

  - in Lecture 11, it explains why the fully specified continuous-null KS test is distribution-free
  - in the continuous-null p-value discussion, it explains why a correctly calibrated p-value is Uniform$(0,1)$

The quick mental map I want is:

- Bernoulli $\to$ Binomial by summing indicators
- Beta prior + Binomial data $\to$ Beta posterior by updating counts
- Exponential $\to$ Gamma by summing waiting times
- Gamma prior + Exponential data $\to$ Gamma posterior by updating event count and total exposure
- null CDF $\to$ Uniform$(0,1)$ by the probability integral transform
- Normal $\to$ Chi-square by squaring and summing standard normals

### Core conceptual statements

- A parametric model buys efficiency if it is approximately correct.
- Delta method is how I move from $\hat\theta$ to $g(\hat\theta)$.
- MLE consistency comes from expected log-likelihood being maximized at the truth.
- Fisher information controls asymptotic precision.
- MLE is asymptotically efficient, not universally optimal in every finite-sample MSE sense.
- Shrinkage can beat unbiased estimators by trading bias for variance reduction.
- Bayes estimator under squared error is posterior mean.
- Priors are uncheckable; models may be misspecified.
- Bootstrap is for approximating uncertainty, not magically reducing it.
- KS compares whole distributions via empirical CDFs.
- Neyman-Pearson says LRT is optimal for simple-vs-simple.
- UMP can exist for one-sided MLR families, but not generally for two-sided alternatives.

---

## 16. Final summary

If I had to summarize the first half of the course in one paragraph, it would be this:

Statistical inference starts by imposing structure on data, usually through a model. Once we estimate parameters by MLE, the next job is to understand uncertainty, which leads to convergence, delta method, score functions, Fisher information, and asymptotic normality. But estimation is not just about unbiasedness or maximum likelihood: decision theory, shrinkage, Bayes estimators, and admissibility show that the criterion matters. Then the course asks what happens when assumptions weaken: priors may be hard to justify, models may be wrong, and analytic variance formulas may be unavailable, so we use objective Bayes ideas, KL-based misspecification logic, and bootstrap methods. Finally, the focus shifts from estimation to testing, first for distributions via KS and then for general hypotheses via likelihood ratios and Neyman-Pearson.

That is the arc I now see behind the course.

---

## 17. A short bridge to reward models

The title of this post ends with **reward models** on purpose.

After reading the CDSS 94 notes on RL, a few ideas felt like modern echoes of the same statistical story:

### 1. KL keeps showing up because "do better, but do not drift too far" is a general problem

In the statistics lectures, KL divergence appears when the model is misspecified: the MLE under the wrong family moves toward the KL-closest approximation to the truth.

In RLHF-style post-training, the objective often looks like

$$
\max_{\pi_\theta} \; \mathbb{E}[r(x,y)] - \beta \, KL(\pi_\theta \,\|\, \pi_{ref}).
$$

That has the same flavor: improve some target objective, but pay a penalty for moving too far from a trusted reference distribution.

### 2. Forward vs. reverse KL is not just a technical distinction

The CDSS94 notes emphasize that **who gets sampled from** matters:

- forward KL is coverage-seeking and conservative
- reverse KL is mode-seeking and sharper

That fits the broader story here too. A lot of statistical procedures differ not just by formula, but by what they encourage:

- coverage vs. concentration
- robustness vs. decisiveness
- exploration vs. exploitation

### 3. Reward models are proxy objectives, and proxy objectives can be gamed

One of the deepest themes of statistics is that we almost never optimize what we truly care about directly. We optimize a tractable stand-in:

- a model family
- a loss function
- a test statistic
- a reward model

The CDSS94 notes make this concrete with reward hacking and chattiness: if the reward model overvalues response length, the model learns length, not quality.

That is just Goodhart's law in a modern form:

> once a proxy becomes the target, the gap between proxy and reality starts to matter a lot.

### 4. Better measurement changes everything

The notes also mention process reward models, reward model ensembles, and iterative reward-model updates.

This feels statistically familiar. If the objective is lossy, one natural response is not just "optimize less," but also:

- measure better
- calibrate better
- check robustness
- change the target when it is obviously being exploited

That is not far from the logic behind better estimators, robust variance corrections, or choosing a test statistic that actually reflects the alternative you care about.

### 5. The connective tissue

So the bridge I see is this:

- classical statistics asks how to make principled decisions from uncertain data
- modern reward-based post-training asks how to shape model behavior from imperfect feedback

In both cases, the hard part is not just optimization. The hard part is that the thing you optimize is usually only an approximation to what you actually want.
